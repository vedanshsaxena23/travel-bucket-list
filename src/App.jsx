import "@fontsource/barriecito";
import { motion } from "motion/react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import CardDiv from "./Components/CardDiv";
import PageNotFound from "./Components/PageNotFound";
import AddMore from "./Components/AddMore";
import About from "./Components/About";
export default function App() {
    return (
        <div className="flex flex-col items-center w-full min-h-screen bg-[#fafafa] pb-20">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mt-16 mb-12 text-center"
            >
                <h1
                    className="text-6xl md:text-7xl text-neutral-900 tracking-tight"
                    style={{ fontFamily: "barriecito" }}
                >
                    Travel <span className="text-neutral-600 font-serif italic text-5xl md:text-6xl">Bucket List</span>
                </h1>
                <p className="mt-4 text-sm text-neutral-500 font-light tracking-[0.3em] uppercase">
                    Boundless horizons • Timeless memories
                </p>
                <div className="mt-6 h-px w-32 bg-linear-to-r from-transparent via-neutral-700 to-transparent mx-auto"></div>
            </motion.div>
            <BrowserRouter>
                <nav className="max-w-full flex justify-center py-1 space-x-12 border-b border-neutral-200 text-sm text-neutral-500 tracking-[0.2em] uppercase">
                    <Link to="/" className="hover:text-neutral-900 transition-colors">Home</Link>
                    <Link to="/form" className="hover:text-neutral-900 transition-colors">Add More</Link>
                    <Link to="/about" className="hover:text-neutral-900 transition-colors">About</Link>
                </nav>
                <Routes>
                    <Route path="/" element = {<CardDiv/>} />
                    <Route path="/form" element = {<AddMore/>} />
                    <Route path="/about" element = {<About/>} />
                    <Route path="*" element = {<PageNotFound/>} />
                </Routes>
            </BrowserRouter>
        </div>
    )
}