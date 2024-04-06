import axios from "axios";
// "https://api.themoviedb.org/3//movie/top_rated?page=1"

const TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMzU3YTMyMmNiOTFlMDA2YzA4M2FjNGFiOGMxMWZlMSIsInN1YiI6IjY1ZGJjOGNmYzJiOWRmMDE4MzhjNzQ1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qpe3gu-nGbeBEyR1yOuProTy6-U66VUydS1WblrnzYE";

export async function getTopMovies(page) {
  // 先在package.json中配置代理，方便维护更改
  const res = await axios.get("https://api.themoviedb.org/3/movie/top_rated", {
    params: { page },
    headers: { Authorization: "Bearer " + TOKEN },
  });
  return res.data;
}
