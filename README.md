Hook基础练习：

1. 练习使用基础hooks: useState, useEffect(体会状态分离，依赖项分离带来的好处)
2. 练习创建使用公共API
3. 练习使用受控组件， 纯函数组件
4. 练习设置组件属性类型和默认值

步骤：

1. 封装获取数据的API接口

    1. Package.json 文件中配置服务器代理，方便维护更改

        ```json
        
          "browserslist": {
          		 ...
            ],
            "development": [
             	...
            ]
          },
                // 配置服务器代理
          "proxy":"https://api.themoviedb.org" // 服务器主机
        }
        ```

    2. service文件夹先创建topMovies.js文件，并且编写api接口

        ```js
        import axios from "axios";
        // "https://api.themoviedb.org/3//movie/top_rated?page=1"
        
        const TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMzU3YTMyMmNiOTFlMDA2YzA4M2FjNGFiOGMxMWZlMSIsInN1YiI6IjY1ZGJjOGNmYzJiOWRmMDE4MzhjNzQ1NCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.qpe3gu-nGbeBEyR1yOuProTy6-U66VUydS1WblrnzYE";
        
        export async function getTopMovies(page) {
          // 先在package.json中配置代理，方便维护更改
          const res = await axios.get("/3/movie/top_rated", {
            params: { page },
            headers: { Authorization: "Bearer " + TOKEN },
          });
          return res.data;
        }
        ```

2. 创建展示电影的组件

    1. components文件件先创建MovieList组件

    2. 该组件仅用于展示数据，没有状态，数据来自传入的props

    3. 添加组件的属性类型和默认熟悉

         ```jsx
         import React from "react";
         import PropTypes from "prop-types";
         
         /**
          * 显示电影列表的组件:根据传入的电影数据，渲染到页面
          * 纯展示组件，没有状态，数据来自外部传入的props
          * @param {*} movies:传入的电影数据数组
          * @returns
          */
         export default function MovieList({ movies }) {
           const movieList = movies.map((m) => <li key={m.id}>{m.original_title}</li>);
           return <ul>{movieList}</ul>;
         }
         MovieList.defaultProps = {
           movies: [],
         };
         MovieList.prototype = {
           movies: PropTypes.array.isRequired,
         };
         ```

3. 创建处理电影数据的组件

    1. components文件件先创建MovieContainer组件

    2. 该组件用于获取电影数据，并传递数据给展示数据的组件

    3. 有状态组件，useState保存和维护状态数据， useEffect获取数据

    4. 仅组件初次挂载（组件完成渲染）后，获取数据，并传递数据： **useEffect依赖项为空数组**

        ```jsx
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
        ```

4. 入口组件App.js中使用MovieContainer组件

    1. 测试组件渲染结果

        ```jsx
        import React from "react";
        import MovieContainer from "./components/MovieContainer";
        
        export default function App() {
          return (
            <div>
              <MovieContainer />
            </div>
          );
        }
        ```

5. 受控组件的使用

    1. 上面的MovieContainer组件中添加受控组件（input)

    2. 受控组件（input)的value值来控制MovieContainer组件的page属性

    3. 设置useEffect的依赖项为page, 这样每次page的变化，都会重新执行useEffect里的函数（调用获取数据API，调用setState函数），从而重新渲染页面

        ```jsx
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
        ```

6. 使用之前的通用组件分页器

    1. common文件夹下加入分页器组件Pager

        ```jsx
        import React from "react";
        import "./Pager.css";
        
        /**
         *
         * @param {*} props
         * currentPage :当前页数
         * pageNumber :页容量
         * totalPage :总页数
         * handerClick :回调函数
         * @returns
         */
        export default function Pager(props) {
          const {
            currentPage,
            pageNumber = 10, //设置默认值
            totalPage,
            handerClick,
          } = props;
        
          const min = getMin(currentPage, pageNumber, totalPage);
          const max = getMax(min, pageNumber);
          const pageNumbers = getPageNumbers(min, max);
          if (!totalPage) {
            return null;
          }
          return (
            <div className="container">
              {/* 首页 */}
              <span
                className={`pager ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => {
                  const targetPage = 1;
                  handerClick(targetPage);
                }}
              >
                首页
              </span>
              {/* 上一页 */}
              <span
                className={`pager ${currentPage === 1 ? "disabled" : ""}`}
                onClick={() => {
                  const targetPage = currentPage <= 1 ? 1 : currentPage - 1;
                  handerClick(targetPage);
                }}
              >
                上一页
              </span>
              {/* 数字页 */}
              {pageNumbers.map((page, i) => (
                <span
                  key={i}
                  className={`pager ${currentPage === page ? "active" : ""}`}
                  onClick={() => {
                    const targetPage = page;
                    handerClick(targetPage);
                  }}
                >
                  {page}
                </span>
              ))}
              {/* 下一页 */}
              <span
                className={`pager ${currentPage === totalPage ? "disabled" : ""}`}
                onClick={() => {
                  const targetPage =
                    currentPage >= totalPage ? totalPage : currentPage + 1;
                  handerClick(targetPage);
                }}
              >
                下一页
              </span>
        
              {/* 尾页 */}
              <span
                className={`pager ${currentPage === totalPage ? "disabled" : ""}`}
                onClick={() => {
                  const targetPage = totalPage;
                  handerClick(targetPage);
                }}
              >
                尾页
              </span>
              <span className="pager show">
                {currentPage} / {totalPage}
              </span>
            </div>
          );
        }
        
        // 辅助函数
        function getMin(currentPage, pageNumber, totalPage) {
          let minNumber = currentPage - pageNumber / 2;
          if (minNumber <= 1) {
            minNumber = 1;
          }
          if (minNumber >= totalPage - pageNumber + 1) {
            minNumber = totalPage - pageNumber + 1;
          }
          return minNumber;
        }
        
        function getMax(minNumber, pageNumber) {
          return minNumber + pageNumber - 1;
        }
        function getPageNumbers(minNumber, maxNumber) {
          let pageNumbers = [];
          for (let i = minNumber; i <= maxNumber; i++) {
            pageNumbers.push(i);
          }
          return pageNumbers;
        }
        ```

        ```css
         /* css 样式*/
        .container {
          margin: 20px auto;
          /* outline: 1px solid red; */
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .container .pager {
          cursor: pointer;
          font-size: 20px;
          color: cornflowerblue;
          padding: 5px;
          margin: 0 10px;
        }
        .container .pager.disabled {
          color: gray;
          cursor: not-allowed;
        }
        .container .pager.active {
          color: orangered;
          cursor: auto;
        }
        .container .pager.show {
          color: black;
        }
        ```

        

    2. 添加分页器组件Pager到MovieContainer组件中（替换掉上一步使用的受控组件input)，用来控制页码的变化

    3. 添加分页器组件需要的状态数据，配置分页器组件Pager的属性

    4. 更改useEffect hook的函数内容：更新电影列表数据，更新总页数，设置依赖项page

    5. 分页器组件Pager传递回调函数，并更新page

        ```jsx
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
        
        ```

7. 优化电影列表的组件样式

    1. 重新设置MovieList组件的结构

        ```jsx
        import React from "react";
        import PropTypes from "prop-types";
        import Movie from "./Movie";
        import "./Movie.css";
        
        /**
         * 显示电影列表的组件:根据传入的电影数据，渲染到页面
         * 纯展示组件，没有状态，数据来自外部传入的props
         * @param {*} movies:传入的电影数据数组
         * @returns
         */
        export default function MovieList({ movies }) {
          const movieList = movies.map((m) => <Movie key={m.id} movie={m} />);
          return (
            <>
              <header className="header">
                <h1>Top Movies</h1>
              </header>
        
              <div className="imgContainer">{movieList}</div>
            </>
          );
        }
        MovieList.defaultProps = {
          movies: [],
        };
        MovieList.prototype = {
          movies: PropTypes.array.isRequired,
        };
        
        ```

        ```jsx
        import React from "react";
        import "./Movie.css";
        
        // TMDB 电影图片和链接地址的前缀
        const IMG_Ex = "https://media.themoviedb.org/t/p/w440_and_h660_face";
        const LINK_EX = "https://www.themoviedb.org/movie/";
        
        export default function Movie(props) {
          const { movie } = props;
          return (
            <div>
              <a href={LINK_EX + movie.id} target="_blank" rel="noopener noreferrer">
                <img src={IMG_Ex + movie.backdrop_path} alt="" />
              </a>
              <a href={LINK_EX + movie.id} target="_blank" rel="noopener noreferrer">
                <p className="title">{movie.title}</p>
              </a>
              <p className="rate">Rate：{movie.vote_average.toFixed(2)}</p>
            </div>
          );
        }
        ```

        

    2. 添加样式

        ```css
        .header {
          margin: 20px auto;
          text-align: center;
        }
        .imgContainer {
          width: 80%;
          margin: 20px auto;
          padding: 20px 0;
          background-color: rgba(234, 241, 242, 0.5);
          border-radius: 20px;
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-row-gap: 30px;
          text-align: center;
        }
        .imgContainer img {
          width: 200px;
          height: 300px;
          object-fit: cover;
        }
        .imgContainer .title {
          margin: 10px 0;
          font-size: 20px;
        }
        .imgContainer .rate {
          color: chocolate;
          font-size: 16px;
        }
        ```

8. 注意：
    
    1. 在gitHub的Pages上托管时，不要设置服务器代理proxy
    2. 分页器组件Pager未使用到hooks，有待完善