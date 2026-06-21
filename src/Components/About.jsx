import { motion } from "motion/react";

export default function About() {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-3xl mx-auto mt-16 px-6 text-center"
        >
            <p className="text-xs text-neutral-500 uppercase tracking-[0.3em] mb-4">
                Our Story
            </p>
            
            <h2 className="text-4xl md:text-5xl text-neutral-800 font-serif italic mb-8">
                About <span style={{ fontFamily: "barriecito" }} className="text-neutral-900 not-italic ml-2">Wander</span>
            </h2>
            
            <div className="h-px w-16 bg-neutral-300 mx-auto mb-10"></div>
            
            <div className="space-y-8 text-sm md:text-base text-neutral-500 font-light leading-loose max-w-2xl mx-auto">
                <p>
                    Wander was born from a simple desire: to keep our travel dreams organized and beautifully displayed. It is more than just a list; it is a curated collection of future memories, waiting to be lived.
                </p>
                <p>
                    Whether it is the neon-lit streets of Tokyo, the serene fjords of Norway, or a quiet cafe tucked away in Paris, every destination holds a story. We built this space to help you map out the corners of the world you long to see.
                </p>
                <p className="uppercase tracking-[0.2em] text-xs font-medium text-neutral-800 mt-12 pt-8 border-t border-neutral-200">
                    Dream big • Travel far • Track it all here
                </p>
            </div>
        </motion.div>
    );
}