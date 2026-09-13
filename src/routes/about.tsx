import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="font-mono text-xs font-bold uppercase tracking-widest">Colophon</p>
      <h1 className="mt-2 font-display text-4xl uppercase leading-none md:text-6xl">
        关于这本书
      </h1>

      <div className="mt-8 space-y-5 text-[15px] leading-7">
        <p>
          这是写给读者的单细胞分析读本，结构对齐 Theislab 的{" "}
          <a
            className="font-bold underline decoration-2 underline-offset-4"
            href="https://www.sc-best-practices.org/"
            target="_blank"
            rel="noreferrer"
          >
            Single-cell best practices
          </a>
          。原书提供可执行 notebook 和持续更新的推荐；这里改写成中文：每一章对应分析的一个阶段，把「为什么这样选」和「错了会怎样」讲成人话，并把教程里常见的图和代码放进正文。
        </p>
        <p>
          视觉采用 Neo-Brutalism（粗边框、硬阴影、高对比色块），参考{" "}
          <a
            className="font-bold underline decoration-2 underline-offset-4"
            href="https://www.designprompts.dev/neo-brutalism"
            target="_blank"
            rel="noreferrer"
          >
            designprompts.dev/neo-brutalism
          </a>
          。
        </p>
      </div>

      <section className="mt-10 border-3 border-ink bg-yellow p-5 shadow-brutal">
        <h2 className="font-display text-2xl uppercase">请这样引用</h2>
        <blockquote className="mt-3 font-mono text-sm leading-6">
          Heumos, L., Schaar, A.C., Lance, C. et al. Best practices for single-cell analysis
          across modalities. Nat Rev Genet (2023). https://doi.org/10.1038/s41576-023-00586-w
        </blockquote>
      </section>

      <section className="mt-8 border-3 border-ink bg-paper p-5 shadow-brutal-sm">
        <h2 className="font-display text-2xl uppercase">许可与仓库</h2>
        <ul className="mt-3 space-y-2 text-sm leading-6">
          <li>原书许可：Apache 2.0（theislab/single-cell-best-practices）。图和代码示意据此改写，不是 notebook 镜像。</li>
          <li>
            本教学整理仓库：{" "}
            <a
              className="font-bold underline decoration-2 underline-offset-4"
              href="https://github.com/ddxyl404/scRNA-practice"
              target="_blank"
              rel="noreferrer"
            >
              github.com/ddxyl404/scRNA-practice
            </a>
          </li>
          <li>进度存在本机浏览器，不上传账号。</li>
        </ul>
      </section>
    </main>
  );
}
