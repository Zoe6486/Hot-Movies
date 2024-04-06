import React, { useEffect, useState } from "react";
import MovieList from "../MovieList";
import { getTopMovies } from "../../server/topMovie";
import Pager from "../../common/Pager/FuncPager";

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
  // 电影总页数
  const [totalPage, setTotalPage] = useState(0);
  // 页容量
  const [pageNumber] = useState(10);
  // 获取数据：当页码变化时，重新获取数据
  useEffect(() => {
    // 在useEffect内部定义一个异步函数
    // 使用立即执行函数
    (async function () {
      const resp = await getTopMovies(page);
      // console.log(resp);
      setMovies(resp.results); // 设置电影数据列表
      setTotalPage(resp.total_pages); // 设置电影总页数
    })();
  }, [page]); // page为依赖项

  return (
    <div>
      <MovieList movies={movies} />
      {/* 使用分页器组件 */}
      <Pager
        currentPage={page}
        pageNumber={pageNumber}
        totalPage={totalPage}
        handerClick={(targetPage) => {
          // 重新设置page
          setPage(targetPage);
          // 从而会调用useEffect的运行，引发页面重新渲染
        }}
      />
    </div>
  );
}
