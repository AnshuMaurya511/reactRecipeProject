import React, { useEffect, useState } from "react";
import RecipeCard from "../components/RecipeCard";
import axios from "axios";
import { Form } from "react-router";
import useLoading from "../hooks/useLoading";

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [totalData, setTotalData] = useState(0);
  const [errorMsg, setErrorMsg] = useState("");
  const {loading, startLoading, stopLoading} = useLoading();
  const [searchQuery, setSearchQuery] = useState("");

  async function FetchRecipes(skipCount, query) {
    startLoading();

    let url = `https://dummyjson.com/recipes?limit=6&skip=${skipCount}`;
    if (query) {
      url = `https://dummyjson.com/recipes/search?limit=6&skip=${skipCount}&q=${query}`;
    }

    try {
      const { data } = await axios.get(url);
      setTotalData(data.total);
      setRecipes((prev) =>
        skipCount === 0 ? data.recipes : [...prev, ...data.recipes],
      );
    } catch (error) {
      setErrorMsg("Not Found");
    }
    stopLoading();
  }

  useEffect(() => {
    FetchRecipes(0, searchQuery);
  }, []);

  function handleSearch(e) {
    e.preventDefault();
    const form = new FormData(e.target);
    let query = form.get("query").trim();

    console.log(query);
    FetchRecipes(0, query);
    setSearchQuery(query);
  }

  if (errorMsg) {
    return (
      <main className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-accent">{errorMsg}</p>
      </main>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center">
        <div className="loader max-w-6xl m-auto "></div>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <form
        className="flex gap-2 max-w-md mx-auto mb-8"
        onSubmit={handleSearch}
      >
        <input
          type="text"
          name="query"
          placeholder="Search recipes..."
          className="flex-1 border border-border rounded px-3 py-2 bg-card text-text outline-none focus:scale-105 transition-all duration-500 focus:border-red-400 "
        />
        <button
          type="submit"
          className="bg-accent hover:bg-accent-hover text-white rounded px-4 py-2 font-medium transition-all duration-500 hover:scale-105"
        >
          Search
        </button>
      </form>

      {recipes.length === 0 && <p>{`"${searchQuery}" product is not found`}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>

      {recipes.length < totalData && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => FetchRecipes(recipes.length, searchQuery)}
            className="bg-accent hover:bg-accent-hover text-white rounded px-6 py-2 font-medium"
          >
            Load More
          </button>
        </div>
      )}
    </main>
  );
};

export default Home;
