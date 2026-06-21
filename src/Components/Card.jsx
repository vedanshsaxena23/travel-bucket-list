// import defaultimage from ".../public/bg.jpg"
import { motion, scale } from "motion/react"
export default function Card({image = "/bg.jpg", imagequote = "Work Fast. Live slow.", title = "Transform your digital presence.", paragraph = "Transform your digital presence by blending creativity with technology. Build a brand that speaks clearly, designs that captivate, and experiences that connect. Whether through sleek websites, engaging visuals, or seamless interactions, the goal is to turn ideas into impact — helping you stand out, inspire trust, and grow in the digital world.", button_text = "Know More", button_link = "https://en.wikipedia.org", main_Characteristics = ["Web", "Product", "Brand"]}) {
    return(
        <motion.div whileHover={{scale:1.1}} transition={{duration:0.8}} initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}>
        <div className="relative max-w-sm bg-[#181b22] h-150 shadow-[0_20px_50px_rgba(28,22,19,0.3)] rounded-2xl overflow-hidden text-white p-5">
            <div className="relative h-70 w-full overflow-hidden rounded-2xl">
                <div className="inset-shadow-xl h-full w-full">
                    <img
                        src={image}
                        alt="background image"
                        className="h-full w-full object-cover "
                    />
                </div>
                <div className="absolute left-4 top-4 font-serif text-sm tracking-wide drop-shadow-sm text-white/90">
                    {imagequote}
                </div>
            </div>
            <div className="mt-6 flex flex-col justify-between">
                <div>
                    <h2 className="font-serif text-3xl font-normal leading-tight text-white/95">
                        {title}
                    </h2>
                    <p className=" max-h-20 overflow-scroll mt-2 text-xs font-light text-neutral-400">
                        {paragraph}
                    </p>
                </div>
            </div>

            <div className="mt-5">
                <button className="rounded-full border border-neutral-600 px-4 py-1.5 tracking-wide text-neutral-300 transition-colors hover:bg-white/10 text-xs " onClick={() => window.location.href = button_link}>
                    {button_text}
                </button>
            </div>
            <div className="absolute flex justify-between bottom-5 left-5 right-5 items-center text-xs uppercase tracking-widest">
                    <span className="lowercase flex text-neutral-400 font-light text-xs ">Vedansh.Saxena.Design</span>
                    <div className=" max-w-xl overflow-x-scroll flex gap-1.5 font-medium justify-end text-neutral-500">
                        <span>{main_Characteristics[0]}</span>
                        <span className="text-neutral-600">+</span>
                        <span>{main_Characteristics[1]}</span>
                        <span className="text-neutral-600">+</span>
                        <span>{main_Characteristics[2]}</span>
                    </div>
            </div>
        </div>
        </motion.div>
    )
}