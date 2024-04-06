import React, { Component } from "react";
import "./Pager.less";

export default class Pager extends Component {
  state = {
    currentPage: this.props.currentPage || 1,
    lastPage: this.props.lastPage,
  };
  handerClick = (targetPage) => {
    this.setState({ currentPage: targetPage });
    this.props.handlerMovies(targetPage);
  };
  render() {
    const { currentPage, lastPage } = this.state;
    const pageNumber = 10;
    let minNumber = currentPage - pageNumber / 2;
    if (minNumber <= 1) {
      minNumber = 1;
    }
    if (minNumber >= lastPage - pageNumber + 1) {
      minNumber = lastPage - pageNumber + 1;
    }
    let maxNumber = minNumber + pageNumber - 1;
    let pageNumbers = [];
    for (let i = minNumber; i <= maxNumber; i++) {
      pageNumbers.push(i);
    }
    return (
      <div className="container">
        {/* 首页 */}
        <span
          className={`pager ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => {
            const targetPage = 1;
            this.handerClick(targetPage);
          }}
        >
          首页
        </span>
        {/* 上一页 */}
        <span
          className={`pager ${currentPage === 1 ? "disabled" : ""}`}
          onClick={() => {
            const targetPage = currentPage <= 1 ? 1 : currentPage - 1;
            this.handerClick(targetPage);
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
              this.handerClick(targetPage);
            }}
          >
            {page}
          </span>
        ))}
        {/* 下一页 */}
        <span
          className={`pager ${currentPage === lastPage ? "disabled" : ""}`}
          onClick={() => {
            const targetPage =
              currentPage >= lastPage ? lastPage : currentPage + 1;
            this.handerClick(targetPage);
          }}
        >
          下一页
        </span>

        {/* 尾页 */}
        <span
          className={`pager ${currentPage === lastPage ? "disabled" : ""}`}
          onClick={() => {
            const targetPage = lastPage;
            this.handerClick(targetPage);
          }}
        >
          尾页
        </span>
      </div>
    );
  }
}
