import React, { useEffect, useState } from "react";
import MovieList from "../MovieList";
import { PropTypes } from "prop-types";
import { getTopMovies } from "../../server/topMovie";

/**
 * 用来处理电影数据（提供数据，控制数据的变化），并传递数据给电影列表组件
 * 有状态组件
 * @returns
 */
export default function MovieContainer({ page }) {
  // 保存数据
  const [movies, setMovies] = useState([]);
  // 获取数据：在组件完成首次渲染之后，获取电影数据
  useEffect(() => {
    // 在useEffect内部定义一个异步函数
    // 使用立即执行函数
    (async function () {
      const resp = await getTopMovies(page);
      // console.log(resp);
      setMovies(resp.results);
    })();
  }, []); // []表示数据没有依赖项，只在组件首次挂载时运行

  return (
    <div>
      <MovieList movies={movies} />
    </div>
  );
}
MovieContainer.prototype = {
  page: PropTypes.number.isRequired,
};
MovieContainer.defaultProps = {
  page: 1,
};
