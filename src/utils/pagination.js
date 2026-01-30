const buildPagination = (page, limit, totalItems, baseUrl) => {
  const totalPages = Math.ceil(totalItems / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    currentPage: page,
    itemsPerPage: limit,
    totalItems,
    totalPages,
    hasNext,
    hasPrev,
    nextPage: hasNext ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
    prevPage: hasPrev ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
  };
};

module.exports = { buildPagination };
