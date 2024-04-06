import React, { useEffect, useState } from "react";
import MovieList from "../MovieList";
import { getTopMovies } from "../../server/topMovie";

/**
 * 用来处理电影数据（提供数据，控制数据的变化），并传递数据给电影列表组件
 * 有状态组件
 * @returns
 */
export default function MovieContainer() {
  // 电影列表数据
  const [movies, setMovies] = useState([]);
  // 显示哪一页的电影列表
  const [page, setPage] = useState(1);
  // 获取数据：在组件完成首次渲染之后，获取电影数据
  useEffect(() => {
    // 在useEffect内部定义一个异步函数
    // 使用立即执行函数
    (async function () {
      const resp = await getTopMovies(page);
      // console.log(resp);
      setMovies(resp.results);
    })();
  }, [page]); // page为依赖项，page变化，组件重新渲染

  return (
    <div>
      <MovieList movies={movies} />
      {/* 受控组件 */}
      <input
        type="number"
        min={1}
        value={page}
        onChange={(e) => setPage(e.target.value)}
      />
    </div>
  );
}
