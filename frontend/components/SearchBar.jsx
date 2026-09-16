"use client";

export default function SearchBar({
  search,
  setSearch,
  onSearch,
  onReset,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        type="search"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder="Rechercher par nom ou catégorie..."
        className="search-input"
      />

      <button type="submit" className="button button-primary">
        Rechercher
      </button>

      <button
        type="button"
        className="button button-light"
        onClick={onReset}
      >
        Réinitialiser
      </button>
    </form>
  );
}