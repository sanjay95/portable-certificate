import { use } from "next-api-middleware";
import type { NextApiRequest, NextApiResponse } from "next";

import { allowedHttpMethods } from "../middlewares/allowed-http-methods";
import { errorHandler } from "../middlewares/error-handler";

const movies = [
  {
    id: 1,
    title: "Baahubali: The Beginning",
    director: ["SS Rajamouli"],
    starring: ["Prabhas", "Anushka Shetty", "Tamannah", "Rana"],
    genre: ["Fictional"],
    imageURL:
      "https://upload.wikimedia.org/wikipedia/en/5/5f/Baahubali_The_Beginning_poster.jpg",
    release: "2015",
  },
  {
    id: 2,
    title: "Vakeel Saab",
    director: ["Venu Sriram"],
    starring: ["Pawan Kalyan", "Nivetha Thomas", "Anjali", "Prakash Raj"],
    genre: ["Feature film"],
    imageURL: "https://upload.wikimedia.org/wikipedia/en/9/97/Vakeel_Saab.jpg",
    release: "2021",
  },
  {
    id: 3,
    title: "RRR",
    director: ["SS Rajamouli"],
    starring: ["N.T.R Jr.", "Ram Charan", "Ajay Devgn", "Alia Bhatt"],
    genre: ["Fictional"],
    imageURL: "https://upload.wikimedia.org/wikipedia/en/d/d7/RRR_Poster.jpg",
    release: "2022",
  },
  {
    id: 4,
    title: "John Wick: Chapter 4",
    director: ["Chad Stahelski"],
    starring: ["Keanu Reeves", "Donnie Yen"],
    genre: ["Action"],
    imageURL:
      "https://upload.wikimedia.org/wikipedia/en/d/d0/John_Wick_-_Chapter_4_promotional_poster.jpg",
    release: "2023",
  },
  {
    id: 5,
    title: "The Avengers",
    director: ["Chad Stahelski"],
    starring: ["Robert Downey Jr.", "Chris Evans"],
    genre: ["Action", "Adventure"],
    imageURL:
      "https://i.pinimg.com/originals/0f/03/e6/0f03e6733b0cf567cc92e8e20290462f.jpg",
    release: "2012",
  },
];

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { actors, directors, genres } = req.body.data || req.body;

  const filterMovies = movies.filter((movie) => {
    if (!actors && !directors && !genres) {
      return true;
    }
    if (
      actors &&
      movie.starring.some((val) =>
        (Array.isArray(actors) ? actors : [actors])
          .map((v: string) => v.toLowerCase())
          .includes(val.toLowerCase())
      )
    ) {
      return true;
    } else if (
      directors &&
      movie.director.some((val) =>
        (Array.isArray(directors) ? directors : [directors])
          .map((v: string) => v.toLowerCase())
          .includes(val.toLowerCase())
      )
    ) {
      return true;
    }
    if (
      genres &&
      movie.genre.some((val) =>
        (Array.isArray(genres) ? genres : [genres])
          .map((v: string) => v.toLowerCase())
          .includes(val.toLowerCase())
      )
    ) {
      return true;
    }
    return false;
  });

  res.status(200).json(filterMovies);
}

export default use(allowedHttpMethods("POST"), errorHandler)(handler);
