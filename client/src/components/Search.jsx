import { Button, Input, ScrollShadow } from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { SearchIcon } from "./SearchIcon";
import axios from "axios";
import { BASEURL } from "../utils/functions";

const Search = ({ projectId, onClick, wid }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const searchHandler = async () => {
    // e.preventDefault()
    if (!search) return;
    const resp = await axios.get(
      `${BASEURL}/api/elementsearch/?projectId=${projectId}&element=${search}`,
      {
        withCredentials: true,
      }
    );
    // console.log(resp.data);
    setResults(resp.data);
    // console.log(search)
  };

  useEffect(() => {
    searchHandler();
  }, [search]);

  return (
    <div className="flex flex-col gap-1">
      <Input
        label="Search"
        isClearable
        radius="lg"
        value={search}
        onValueChange={setSearch}
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60 ",
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "shadow-xl",
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-xl",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focused=true]:bg-default-200/50",
            "dark:group-data-[focused=true]:bg-default/60",
            "!cursor-text",
          ],
        }}
        placeholder="Type to search..."
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
      />
      <ScrollShadow className="flex flex-col rounded-md gap-1">
        {results?.map((res) => {
          if (res?.workspaces?.map((w) => w.workspaceId).includes(wid))
            return null;
          return (
            <Button key={res._id} onPress={() => onClick(res)}>
              {res.name}
            </Button>
          );
        })}
      </ScrollShadow>
    </div>
  );
};

export default Search;
