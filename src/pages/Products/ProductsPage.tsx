import { useEffect, useRef, useState } from "react";
import { useProductsStore } from "../../store/productsStore";
import { useDebounce } from "../../hooks/useDebounce";
import { formatPriceParts } from "../../utils/format";
import { AddProductModal } from "./AddProductModal";
import "./ProductsPage.css";

export const ProductsPage: React.FC = () => {
  const products = useProductsStore((s) => s.products);
  const total = useProductsStore((s) => s.total);
  const isLoading = useProductsStore((s) => s.isLoading);
  const page = useProductsStore((s) => s.page);
  const limit = useProductsStore((s) => s.limit);
  const sortBy = useProductsStore((s) => s.sortBy);
  const sortOrder = useProductsStore((s) => s.sortOrder);
  const selectedIds = useProductsStore((s) => s.selectedIds);
  const fetchProducts = useProductsStore((s) => s.fetchProducts);
  const setPage = useProductsStore((s) => s.setPage);
  const setSort = useProductsStore((s) => s.setSort);
  const setSearch = useProductsStore((s) => s.setSearch);
  const toggleSelect = useProductsStore((s) => s.toggleSelect);
  const toggleSelectAll = useProductsStore((s) => s.toggleSelectAll);

  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const debouncedSearch = useDebounce(searchInput, 400);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      // Reset search state on mount to clear any stale filter, then fetch
      setSearch('');
      return;
    }
    setSearch(debouncedSearch);
  }, [debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalPages = Math.ceil(total / limit);
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, total);

  const getPaginationPages = (): number[] => {
    const pages: number[] = [];
    const maxVisible = 5;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else if (page <= 3) {
      for (let i = 1; i <= maxVisible; i++) pages.push(i);
    } else if (page >= totalPages - 2) {
      for (let i = totalPages - maxVisible + 1; i <= totalPages; i++)
        pages.push(i);
    } else {
      for (let i = page - 2; i <= page + 2; i++) pages.push(i);
    }
    return pages;
  };

  const renderSortIndicator = (field: "title" | "rating" | "price") => {
    if (sortBy !== field) return null;
    return (
      <span className="pp-sort-arrow">{sortOrder === "asc" ? "↑" : "↓"}</span>
    );
  };

  return (
    <div className="pp-page">
      <div className="pp-body">
        {/* Navigation bar */}
        <div className="pp-navbar">
          <div className="pp-navbar-title">Товары</div>
          <div className="pp-navbar-menu">
            <div className="pp-search">
              <svg className="pp-search-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 21L16.65 16.65" stroke="#999999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Найти"
                className="pp-search-input"
              />
            </div>
          </div>
        </div>

        {/* Content card */}
        <div className="pp-content">
          <div className="pp-card">
            {/* Card header */}
            <div className="pp-card-header">
              <h2 className="pp-card-title">Все позиции</h2>
              <div className="pp-card-actions">
                <button
                  className="pp-refresh-btn"
                  onClick={() => fetchProducts()}
                  title="Обновить"
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M16.9873 16.0162C17.1156 16.145 17.1876 16.3195 17.1876 16.5013C17.1876 16.6831 17.1156 16.8576 16.9873 16.9864C16.8936 17.0784 14.6798 19.25 11 19.25C7.7868 19.25 5.45445 17.325 4.125 15.8254V17.875C4.125 18.0573 4.05257 18.2322 3.92364 18.3611C3.7947 18.4901 3.61984 18.5625 3.4375 18.5625C3.25516 18.5625 3.0803 18.4901 2.95136 18.3611C2.82243 18.2322 2.75 18.0573 2.75 17.875V13.75C2.75 13.5677 2.82243 13.3928 2.95136 13.2639C3.0803 13.1349 3.25516 13.0625 3.4375 13.0625H7.5625C7.74484 13.0625 7.9197 13.1349 8.04864 13.2639C8.17757 13.3928 8.25 13.5677 8.25 13.75C8.25 13.9323 8.17757 14.1072 8.04864 14.2361C7.9197 14.3651 7.74484 14.4375 7.5625 14.4375H4.76437C5.82312 15.7566 7.99219 17.875 11 17.875C14.0938 17.875 15.9964 16.0308 16.0153 16.0119C16.1448 15.8836 16.3199 15.812 16.5022 15.8128C16.6844 15.8136 16.8589 15.8868 16.9873 16.0162ZM18.5625 3.4375C18.3802 3.4375 18.2053 3.50993 18.0764 3.63886C17.9474 3.7678 17.875 3.94266 17.875 4.125V6.17461C16.5455 4.675 14.2132 2.75 11 2.75C7.32016 2.75 5.10641 4.92164 5.01359 5.01359C4.88436 5.14237 4.81158 5.31721 4.81126 5.49964C4.81094 5.68208 4.8831 5.85718 5.01187 5.98641C5.14065 6.11564 5.31549 6.18842 5.49793 6.18874C5.68036 6.18906 5.85546 6.1169 5.98469 5.98813C6.00359 5.96922 7.90625 4.125 11 4.125C14.0078 4.125 16.1769 6.24336 17.2356 7.5625H14.4375C14.2552 7.5625 14.0803 7.63493 13.9514 7.76386C13.8224 7.8928 13.75 8.06766 13.75 8.25C13.75 8.43234 13.8224 8.6072 13.9514 8.73614C14.0803 8.86507 14.2552 8.9375 14.4375 8.9375H18.5625C18.7448 8.9375 18.9197 8.86507 19.0486 8.73614C19.1776 8.6072 19.25 8.43234 19.25 8.25V4.125C19.25 3.94266 19.1776 3.7678 19.0486 3.63886C18.9197 3.50993 18.7448 3.4375 18.5625 3.4375Z" fill="#515161"/>
                  </svg>
                </button>
                <button
                  className="pp-add-btn"
                  onClick={() => setShowModal(true)}
                >
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <path d="M11 2.0625C9.23233 2.0625 7.50436 2.58668 6.0346 3.56874C4.56483 4.55081 3.41929 5.94665 2.74283 7.57977C2.06637 9.21288 1.88938 11.0099 2.23424 12.7436C2.57909 14.4773 3.43031 16.0698 4.68024 17.3198C5.93017 18.5697 7.52268 19.4209 9.25638 19.7658C10.9901 20.1106 12.7871 19.9336 14.4202 19.2572C16.0534 18.5807 17.4492 17.4352 18.4313 15.9654C19.4133 14.4956 19.9375 12.7677 19.9375 11C19.935 8.6304 18.9926 6.35856 17.317 4.683C15.6414 3.00743 13.3696 2.065 11 2.0625ZM11 18.5625C9.50428 18.5625 8.04215 18.119 6.7985 17.288C5.55486 16.457 4.58555 15.2759 4.01316 13.894C3.44078 12.5122 3.29101 10.9916 3.58282 9.52463C3.87462 8.05765 4.59487 6.71014 5.65251 5.65251C6.71014 4.59487 8.05765 3.87461 9.52463 3.58281C10.9916 3.29101 12.5122 3.44077 13.894 4.01316C15.2759 4.58555 16.457 5.55485 17.288 6.7985C18.119 8.04215 18.5625 9.50428 18.5625 11C18.5602 13.005 17.7627 14.9272 16.345 16.345C14.9272 17.7627 13.005 18.5602 11 18.5625ZM15.125 11C15.125 11.1823 15.0526 11.3572 14.9236 11.4861C14.7947 11.6151 14.6198 11.6875 14.4375 11.6875H11.6875V14.4375C11.6875 14.6198 11.6151 14.7947 11.4861 14.9236C11.3572 15.0526 11.1823 15.125 11 15.125C10.8177 15.125 10.6428 15.0526 10.5139 14.9236C10.3849 14.7947 10.3125 14.6198 10.3125 14.4375V11.6875H7.5625C7.38017 11.6875 7.2053 11.6151 7.07637 11.4861C6.94744 11.3572 6.875 11.1823 6.875 11C6.875 10.8177 6.94744 10.6428 7.07637 10.5139C7.2053 10.3849 7.38017 10.3125 7.5625 10.3125H10.3125V7.5625C10.3125 7.38016 10.3849 7.2053 10.5139 7.07636C10.6428 6.94743 10.8177 6.875 11 6.875C11.1823 6.875 11.3572 6.94743 11.4861 7.07636C11.6151 7.2053 11.6875 7.38016 11.6875 7.5625V10.3125H14.4375C14.6198 10.3125 14.7947 10.3849 14.9236 10.5139C15.0526 10.6428 15.125 10.8177 15.125 11Z" fill="white"/>
                  </svg>
                  <span>Добавить</span>
                </button>
              </div>
            </div>

            {/* Progress bar */}
            {isLoading && (
              <div className="pp-progress-wrap">
                <div className="pp-progress-bar" />
              </div>
            )}

            {/* Table */}
            <div className="pp-table-wrap">
              {/* Header row */}
              <div className="pp-table-header">
                <div className="pp-col-product">
                  <label className="pp-checkbox-wrap">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={
                        products.length > 0 &&
                        selectedIds.size === products.length
                      }
                      onChange={toggleSelectAll}
                    />
                    <span
                      className={`pp-checkbox ${products.length > 0 && selectedIds.size === products.length ? "pp-checkbox--checked" : ""}`}
                    />
                  </label>
                  <button
                    className="pp-col-label"
                    onClick={() => setSort("title")}
                  >
                    Наименование{renderSortIndicator("title")}
                  </button>
                </div>
                <div className="pp-col-details">
                  <span className="pp-col-label pp-col-vendor">Вендор</span>
                  <span className="pp-col-label pp-col-sku">Артикул</span>
                  <button
                    className="pp-col-label pp-col-rating"
                    onClick={() => setSort("rating")}
                  >
                    Оценка{renderSortIndicator("rating")}
                  </button>
                  <button
                    className="pp-col-label pp-col-price"
                    onClick={() => setSort("price")}
                  >
                    Цена, ₽{renderSortIndicator("price")}
                  </button>
                  <span className="pp-col-label pp-col-actions-spacer">.</span>
                </div>
              </div>

              {/* Product rows */}
              {products.map((product) => {
                const isSelected = selectedIds.has(product.id);
                const priceParts = formatPriceParts(product.price);
                const isLowRating = product.rating < 3;

                return (
                  <div
                    key={product.id}
                    className={`pp-row ${isSelected ? "pp-row--selected" : ""}`}
                  >
                    <div
                      className={`pp-row-inner ${isSelected ? "pp-row-inner--selected" : ""}`}
                    >
                      {isSelected && <div className="pp-row-stripe" />}
                      <div className="pp-col-product">
                        <label className="pp-checkbox-wrap">
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isSelected}
                            onChange={() => toggleSelect(product.id)}
                          />
                          <span
                            className={`pp-checkbox ${isSelected ? "pp-checkbox--checked" : ""}`}
                          />
                        </label>
                        <div className="pp-product-photo">
                          {product.thumbnail ? (
                            <img
                              src={product.thumbnail}
                              alt=""
                              loading="lazy"
                            />
                          ) : null}
                        </div>
                        <div className="pp-product-name">
                          <p className="pp-product-title" title={product.title}>
                            {product.title}
                          </p>
                          <p className="pp-product-category">
                            {product.category}
                          </p>
                        </div>
                      </div>
                      <div className="pp-col-details">
                        <span
                          className="pp-cell-vendor"
                          title={product.brand || undefined}
                        >
                          {product.brand || "—"}
                        </span>
                        <span
                          className="pp-cell-sku"
                          title={product.sku || undefined}
                        >
                          {product.sku || "—"}
                        </span>
                        <span className="pp-cell-rating">
                          <span className={isLowRating ? "pp-rating-low" : ""}>
                            {product.rating}
                          </span>
                          <span className="pp-rating-total">/5</span>
                        </span>
                        <span className="pp-cell-price">
                          <span className="pp-price-int">
                            {priceParts.integer}
                          </span>
                          <span className="pp-price-dec">
                            {priceParts.decimal}
                          </span>
                        </span>
                        <div className="pp-cell-actions">
                          <button className="pp-action-add" aria-label="Добавить">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5V19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M5 12H19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                          <button className="pp-action-more" aria-label="Ещё">
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                              <path d="M16 3C13.4288 3 10.9154 3.76244 8.77759 5.1909C6.63975 6.61935 4.97351 8.64968 3.98957 11.0251C3.00563 13.4006 2.74819 16.0144 3.2498 18.5362C3.75141 21.0579 4.98953 23.3743 6.80762 25.1924C8.6257 27.0105 10.9421 28.2486 13.4638 28.7502C15.9856 29.2518 18.5995 28.9944 20.9749 28.0104C23.3503 27.0265 25.3807 25.3603 26.8091 23.2224C28.2376 21.0846 29 18.5712 29 16C28.9964 12.5533 27.6256 9.24882 25.1884 6.81163C22.7512 4.37445 19.4467 3.00364 16 3ZM16 27C13.8244 27 11.6977 26.3549 9.88873 25.1462C8.07979 23.9375 6.66989 22.2195 5.83733 20.2095C5.00477 18.1995 4.78693 15.9878 5.21137 13.854C5.63581 11.7202 6.68345 9.7602 8.22183 8.22183C9.76021 6.68345 11.7202 5.6358 13.854 5.21136C15.9878 4.78692 18.1995 5.00476 20.2095 5.83733C22.2195 6.66989 23.9375 8.07979 25.1462 9.88873C26.3549 11.6977 27 13.8244 27 16C26.9967 18.9164 25.8367 21.7123 23.7745 23.7745C21.7123 25.8367 18.9164 26.9967 16 27ZM17.5 16C17.5 16.2967 17.412 16.5867 17.2472 16.8334C17.0824 17.08 16.8481 17.2723 16.574 17.3858C16.2999 17.4993 15.9983 17.5291 15.7074 17.4712C15.4164 17.4133 15.1491 17.2704 14.9393 17.0607C14.7296 16.8509 14.5867 16.5836 14.5288 16.2926C14.471 16.0017 14.5007 15.7001 14.6142 15.426C14.7277 15.1519 14.92 14.9176 15.1667 14.7528C15.4133 14.588 15.7033 14.5 16 14.5C16.3978 14.5 16.7794 14.658 17.0607 14.9393C17.342 15.2206 17.5 15.6022 17.5 16ZM23 16C23 16.2967 22.912 16.5867 22.7472 16.8334C22.5824 17.08 22.3481 17.2723 22.074 17.3858C21.7999 17.4993 21.4983 17.5291 21.2074 17.4712C20.9164 17.4133 20.6491 17.2704 20.4393 17.0607C20.2296 16.8509 20.0867 16.5836 20.0288 16.2926C19.9709 16.0017 20.0007 15.7001 20.1142 15.426C20.2277 15.1519 20.42 14.9176 20.6667 14.7528C20.9133 14.588 21.2033 14.5 21.5 14.5C21.8978 14.5 22.2794 14.658 22.5607 14.9393C22.842 15.2206 23 15.6022 23 16ZM12 16C12 16.2967 11.912 16.5867 11.7472 16.8334C11.5824 17.08 11.3481 17.2723 11.074 17.3858C10.7999 17.4993 10.4983 17.5291 10.2074 17.4712C9.9164 17.4133 9.64912 17.2704 9.43935 17.0607C9.22957 16.8509 9.08671 16.5836 9.02883 16.2926C8.97095 16.0017 9.00065 15.7001 9.11419 15.426C9.22772 15.1519 9.41998 14.9176 9.66665 14.7528C9.91332 14.588 10.2033 14.5 10.5 14.5C10.8978 14.5 11.2794 14.658 11.5607 14.9393C11.842 15.2206 12 15.6022 12 16Z" fill="#B2B3B9"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!isLoading && products.length === 0 && (
                <div className="pp-empty">Товары не найдены</div>
              )}
            </div>

            {/* Footer — pagination */}
            {total > 0 && (
              <div className="pp-footer">
                <p className="pp-shown">
                  <span className="pp-shown-label">Показано </span>
                  <span className="pp-shown-value">
                    {startItem}-{endItem}
                  </span>
                  <span className="pp-shown-label"> из </span>
                  <span className="pp-shown-value">{total}</span>
                </p>
                <div className="pp-pagination">
                  <button
                    className="pp-page-arrow"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    aria-label="Предыдущая страница"
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path
                        d="M19 8L11 16L19 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="pp-page-numbers">
                    {getPaginationPages().map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`pp-page-num ${page === p ? "pp-page-num--active" : ""}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    className="pp-page-arrow"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages}
                    aria-label="Следующая страница"
                  >
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <path
                        d="M13 8L21 16L13 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && <AddProductModal onClose={() => setShowModal(false)} />}
    </div>
  );
};
