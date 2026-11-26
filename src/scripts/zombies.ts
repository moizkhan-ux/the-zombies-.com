const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const reveal = (root: ParentNode) => {
  const nodes = root.querySelectorAll<HTMLElement>(".z-card, .z-profile");
  if (reduce()) {
    nodes.forEach((n) => n.classList.add("seen"));
    return;
  }
  const io = new IntersectionObserver(
    (ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("seen");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  nodes.forEach((n) => io.observe(n));
};

const tilt = (root: ParentNode) => {
  if (reduce() || !finePointer()) return;
  root.querySelectorAll<HTMLElement>(".z-card-inner").forEach((inner) => {
    inner.addEventListener("pointermove", (e) => {
      const r = inner.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      inner.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg) translateY(-6px)`;
    });
    inner.addEventListener("pointerleave", () => {
      inner.style.transform = "";
    });
  });
};

const countUp = (root: ParentNode) => {
  root.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
    const to = Number(el.dataset.count);
    if (!Number.isFinite(to)) return;
    if (reduce()) {
      el.textContent = String(to);
      return;
    }
    const start = performance.now();
    const run = (now: number) => {
      const t = Math.min(1, (now - start) / 800);
      el.textContent = String(Math.round(to * t));
      if (t < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  });
};

const filterRoster = (root: HTMLElement) => {
  const grid = root.querySelector<HTMLElement>("[data-z-grid]");
  const count = root.querySelector<HTMLElement>("[data-z-count]");
  const search = root.querySelector<HTMLInputElement>("[data-z-search]");
  if (!grid || !count) return;
  const cards = [...grid.querySelectorAll<HTMLElement>(".z-card")];
  const total = cards.length;
  let sort = "rank";
  let talent = "all";

  const apply = () => {
    const q = (search?.value || "").trim().toLowerCase();
    const visible = cards.filter((card) => {
      const name = (card.dataset.name || "").toLowerCase();
      const roll = card.dataset.roll || "";
      const t = card.dataset.talent || "";
      const hitQ = !q || name.includes(q) || roll.includes(q);
      const hitT = talent === "all" || t === talent;
      const on = hitQ && hitT;
      card.hidden = !on;
      return on;
    });
    visible.sort((a, b) => {
      if (sort === "az") return (a.dataset.name || "").localeCompare(b.dataset.name || "");
      if (sort === "roll") return Number(a.dataset.roll) - Number(b.dataset.roll);
      return Number(b.dataset.overall) - Number(a.dataset.overall);
    });
    visible.forEach((card) => grid.appendChild(card));
    count.textContent = `Showing ${visible.length} of ${total} zombies`;
    root.querySelector("[data-z-roster]")?.classList.toggle("is-empty", visible.length === 0);
  };

  search?.addEventListener("input", apply);
  root.querySelectorAll<HTMLButtonElement>("[data-sort]").forEach((btn) => {
    btn.addEventListener("click", () => {
      sort = btn.dataset.sort || "rank";
      root.querySelectorAll("[data-sort]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      apply();
    });
  });
  root.querySelectorAll<HTMLButtonElement>("[data-talent]").forEach((btn) => {
    btn.addEventListener("click", () => {
      talent = btn.dataset.talent || "all";
      root.querySelectorAll("[data-talent]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      apply();
    });
  });
  apply();
};

const photoFallback = (root: ParentNode) => {
  root.querySelectorAll<HTMLImageElement>(".z-photo").forEach((img) => {
    const ok = () => {
      if (img.naturalWidth > 0) img.classList.add("is-on");
    };
    img.addEventListener("load", ok);
    if (img.complete) ok();
  });
};

export const enhanceZombies = (root: HTMLElement) => {
  photoFallback(root);
  reveal(root);
  tilt(root);
  countUp(root);
  if (root.querySelector("[data-z-grid]")) filterRoster(root);
};
