import React, { useState, useEffect } from "react";

type Props = {
  onSearch: (query: string) => void;
};

export const SearchBar: React.FC<Props> = ({ onSearch }) => {
  const [term, setTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(term);
    }, 250);

    return () => clearTimeout(timeout);
  }, [term]);

  return (
    <input
      placeholder="Search"
      value={term}
      onChange={(e) => setTerm(e.target.value)}
      aria-label="Anime search input"
      type="text"
      role="searchbox"
      autoFocus
    />
  );
};
