"use client"
import React, { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../app/firebaseconfig.js";

const Blogmain = () => {
  const fetchData = async () => {
    const docRef = doc(db, "posts", "TestPost");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <div className="sm:py-20 p-4 flex flex-col flex-grow items-center justify-start min-h-screen w-full">
      <h1 className="text-5xl font-bold">Blog</h1>
      <p className="text-lg">Coming soon!</p>
    </div>
  );
};

export default Blogmain;