export default function() {
    return(
        <div class="flex min-h-screen items-center justify-center bg-[#D7CBBF] p-6 font-sans">
  
  <div class="relative w-full max-w-sm overflow-hidden rounded-[24px] bg-[#1C1613] p-6 text-white shadow-[0_20px_50px_rgba(28,22,19,0.3)]">
    
    <div class="relative h-[280px] w-full overflow-hidden rounded-[18px]">
      <img 
        src="https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=600&auto=format&fit=crop" 
        alt="Futuristic anime city landscape" 
        class="h-full w-full object-cover"
      />
      <div class="absolute left-4 top-4 font-serif text-sm tracking-wide text-white/90 drop-shadow-sm">
        Work fast. Live slow.
      </div>
    </div>

    <div class="mt-6 flex flex-col justify-between">
      <div>
        <h2 class="font-serif text-[26px] font-normal leading-tight text-white/95">
          Transform your digital presence.
        </h2>
        <p class="mt-2 text-xs font-light text-neutral-400">
          From zero to extraordinary. Let's create your digital reality.
        </p>
      </div>

      <div class="mt-5">
        <button class="rounded-full border border-neutral-600 px-4 py-1.5 text-xs font-light tracking-wide text-neutral-300 transition-colors hover:bg-white/10">
          Send a message
        </button>
      </div>

      <div class="mt-10 flex items-center justify-between border-t border-white/5 pt-4 text-[10px] uppercase tracking-widest text-neutral-500">
        <span class="lowercase text-neutral-400 font-light">sukoya.design</span>
        <div class="flex gap-1.5 font-medium">
          <span>web</span>
          <span class="text-neutral-600">+</span>
          <span>product</span>
          <span class="text-neutral-600">+</span>
          <span>brand</span>
        </div>
      </div>
    </div>

  </div>
</div>
    )
}