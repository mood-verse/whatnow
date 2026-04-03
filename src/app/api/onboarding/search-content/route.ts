import { NextRequest, NextResponse } from "next/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const GOOGLE_BOOKS_API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

interface SearchResult {
  id: number | string;
  title: string;
  year?: number;
  format: "movie" | "series" | "book";
  rating?: number;
  image?: string;
}

async function searchTMDB(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  try {
    // Buscar películas
    const movieRes = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
        query
      )}&api_key=${TMDB_API_KEY}&language=es-ES`
    );
    const movieData = await movieRes.json();

    if (movieData.results) {
      movieData.results.slice(0, 2).forEach((movie: any) => {
        results.push({
          id: movie.id,
          title: movie.title,
          year: movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : undefined,
          format: "movie",
          rating: movie.vote_average,
          image: movie.poster_path,
        });
      });
    }

    // Buscar series
    const seriesRes = await fetch(
      `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(
        query
      )}&api_key=${TMDB_API_KEY}&language=es-ES`
    );
    const seriesData = await seriesRes.json();

    if (seriesData.results) {
      seriesData.results.slice(0, 2).forEach((series: any) => {
        results.push({
          id: series.id,
          title: series.name,
          year: series.first_air_date
            ? new Date(series.first_air_date).getFullYear()
            : undefined,
          format: "series",
          rating: series.vote_average,
          image: series.poster_path,
        });
      });
    }
  } catch (error) {
    console.error("Error searching TMDB:", error);
  }

  return results;
}

async function searchGoogleBooks(query: string): Promise<SearchResult[]> {
  const results: SearchResult[] = [];

  try {
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        query
      )}&key=${GOOGLE_BOOKS_API_KEY}&maxResults=2`
    );
    const data = await response.json();

    if (data.items) {
      data.items.forEach((book: any) => {
        results.push({
          id: book.id,
          title: book.volumeInfo.title,
          year: book.volumeInfo.publishedDate
            ? new Date(book.volumeInfo.publishedDate).getFullYear()
            : undefined,
          format: "book",
          rating: book.volumeInfo.averageRating,
          image: book.volumeInfo.imageLinks?.thumbnail,
        });
      });
    }
  } catch (error) {
    console.error("Error searching Google Books:", error);
  }

  return results;
}

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("query");

  if (!query || query.length < 2) {
    return NextResponse.json(
      { error: "Query must be at least 2 characters" },
      { status: 400 }
    );
  }

  try {
    const [tmdbResults, booksResults] = await Promise.all([
      searchTMDB(query),
      searchGoogleBooks(query),
    ]);

    // Combinar y ordenar por relevancia
    const allResults = [...tmdbResults, ...booksResults].slice(0, 10);

    return NextResponse.json(allResults);
  } catch (error) {
    console.error("Error in search:", error);
    return NextResponse.json(
      { error: "Error searching content" },
      { status: 500 }
    );
  }
}
