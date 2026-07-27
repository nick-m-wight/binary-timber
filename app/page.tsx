/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Reveal from "./reveal";
import ContactForm from "./contact-form";

export default function Home() {
  return (
    <>
      <Reveal />

      <nav aria-label="Main navigation">
        <Link href="/" className="logo" aria-label="Binary Timber Holdings — Home">
          <img src="/hort.png" alt="Binary Timber Holdings" className="logo-img" />
        </Link>
        <ul>
          <li><a href="#about">About</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#showcase">Showcase</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><Link href="/pricing">Pricing</Link></li>
          <li><Link href="/auth/login">Sign In</Link></li>
        </ul>
      </nav>

      <main>
        <section className="hero" aria-labelledby="hero-heading">
          <div className="hero-content">
            <div className="eyebrow">Tech Holdings // EST. 2025</div>
            <h1 id="hero-heading">
              Where <span className="italic">code</span><br />
              meets <span className="accent">craft</span>
            </h1>
            <p className="hero-sub">
              Binary Timber Holdings is a parent company building at the intersection of intelligent software and precision manufacturing — where bits become objects, and objects gain intelligence.
            </p>
            <div className="hero-meta">
              <div>
                <div className="label">Divisions</div>
                <div className="value">02</div>
              </div>
              <div>
                <div className="label">Disciplines</div>
                <div className="value">AI · CNC</div>
              </div>
              <div>
                <div className="label">Status</div>
                <div className="value">Active</div>
              </div>
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="card-binary">
              01001000<br />
              01100101<br />
              01101100<br />
              01101100<br />
              01101111
            </div>
            <div className="visual-card card-code">
              <div className="header">
                <span></span><span></span><span></span>
              </div>
              <div><span className="comment">// binary_timber.init()</span></div>
              <div><span className="keyword">const</span> divisions = [</div>
              <div>&nbsp;&nbsp;<span className="string">'ai_software'</span>,</div>
              <div>&nbsp;&nbsp;<span className="string">'cnc_manufacturing'</span></div>
              <div>];</div>
              <div><span className="keyword">return</span> craft(divisions);</div>
            </div>
            <div className="visual-card card-wood">
              <span className="label">// milled_oak.v3</span>
            </div>
          </div>
        </section>

        <section className="about" id="about" aria-labelledby="about-heading">
          <div className="section-header reveal">
            <div className="section-num">01 / About</div>
            <h2 id="about-heading">A holding company for <span className="italic">two disciplines</span>.</h2>
          </div>

          <div className="about-grid">
            <div className="about-text reveal">
              <p>
                We operate at a deliberate intersection: the digital and the physical, the abstract and the made.
              </p>
              <p>
                Binary Timber Holdings is the parent company for ventures spanning intelligent software and precision-machined goods. Each division operates independently, but shares a single conviction — that the best work happens when craftsmanship is the through-line, whether the medium is silicon or solid wood.
              </p>
            </div>

            <div className="divisions reveal">
              <div className="division">
                <div className="division-tag">// Division 01</div>
                <h3>AI Software Development</h3>
                <p>Custom AI solutions, model integrations, and intelligent automation tooling built for businesses that need real outcomes — not demos.</p>
              </div>
              <div className="division">
                <div className="division-tag">// Division 02</div>
                <h3>Custom CNC Manufacturing</h3>
                <p>Precision machining and bespoke fabrication. From prototype to production run, milled with tolerance and finished with care.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" aria-labelledby="projects-heading">
          <div className="section-header reveal">
            <div className="section-num">02 / Projects</div>
            <h2 id="projects-heading">Selected <span className="italic">work.</span></h2>
          </div>

          <div className="projects-grid">
            <div className="project reveal">
              <div className="project-meta">
                <span className="type-ai">// AI Software</span>
                <span>2025</span>
              </div>
              <h3>ChefHub</h3>
              <p>AI-powered culinary marketplace and streaming platform connecting home cooks with professional chefs — live streaming, bookings, and Claude-parsed recipes, built and deployed on Vercel.</p>
              <a className="project-link" href="https://chefhub.dev" target="_blank" rel="noopener noreferrer">chefhub.dev →</a>
              <br />
              <a className="project-link" href="https://github.com/nick-m-wight/chef-hub" target="_blank" rel="noopener noreferrer">GitHub →</a>
            </div>

            {/* NOTE: repo is private as of writing — link goes live once it's flipped to public */}
            <div className="project reveal">
              <div className="project-meta">
                <span className="type-ai">// AI Software</span>
                <span>2026</span>
              </div>
              <h3>Quiet Trader</h3>
              <p>A nonprofit trading-alert marketplace — build alerts from real indicators, track public performance, and follow a nightly AI-ranked leaderboard. Optional auto-execute via Alpaca, paper or live.</p>
              <a className="project-link" href="https://quiet-trader.vercel.app/" target="_blank" rel="noopener noreferrer">quiet-trader.vercel.app →</a>
              <br />
              <a className="project-link" href="https://github.com/nick-m-wight/quiet-trader" target="_blank" rel="noopener noreferrer">GitHub →</a>
              <p className="project-disclaimer">// nonprofit platform — no financial advice given; alerts are user-generated signals, not licensed investment guidance</p>
            </div>

            <div className="project reveal">
              <div className="project-meta">
                <span className="type-ai">// AI Software</span>
                <span>2026</span>
              </div>
              <h3>tech-garden</h3>
              <p>A smart-glasses home &amp; garden assistant — voice commands hit Home Assistant, and a photo of a struggling plant gets a Claude Vision diagnosis straight to the companion app.</p>
              <a className="project-link" href="https://github.com/nick-m-wight/tech-garden" target="_blank" rel="noopener noreferrer">GitHub →</a>
            </div>

            <div className="project reveal">
              <div className="project-meta">
                <span className="type-eng">// Hardware / IoT</span>
                <span>2026</span>
              </div>
              <h3>plant-monitor</h3>
              <p>A solar-powered ESP32 sensor station — soil moisture, climate, and pressure readings streamed to Home Assistant over MQTT. No AI here, just clean embedded engineering.</p>
              <a className="project-link" href="https://github.com/nick-m-wight/plant-monitor" target="_blank" rel="noopener noreferrer">GitHub →</a>
            </div>

            <div className="project reveal">
              <div className="project-meta">
                <span className="type-eng">// Systems Engineering</span>
                <span>2026</span>
              </div>
              <h3>Agent Sync Engine</h3>
              <p>A production-grade bidirectional sync layer between a chat platform and a business phone system — real-time webhook handling, idempotent event processing, and unified agent presence across both.</p>
              <a className="project-link" href="https://github.com/nick-m-wight/livechat-ringcentral-sync" target="_blank" rel="noopener noreferrer">GitHub →</a>
            </div>

            <div className="project reveal">
              <div className="project-meta">
                <span className="type-cnc">// CNC Manufacturing</span>
                <span>2026</span>
              </div>
              <h3>Timber Trace Origins</h3>
              <p>Custom CNC-machined wood products — cutting boards, engraved signs, cribbage boards, and folding game tables, precision-cut from quality hardwoods and finished by hand.</p>
              <a className="project-link" href="https://timbertrace.shop/shop/" target="_blank" rel="noopener noreferrer">timbertrace.shop →</a>
            </div>
          </div>
        </section>

        <section id="showcase" aria-labelledby="showcase-heading">
          <div className="section-header reveal">
            <div className="section-num">03 / Showcase</div>
            <h2 id="showcase-heading">How the <span className="italic">AI</span> actually works.</h2>
            <p className="section-lede">A closer look at five AI integrations from the projects above — shipped code, not demos.</p>
          </div>

          <div className="showcase-list">
            <div className="showcase-item reveal">
              <div className="showcase-text">
                <div className="showcase-tag">// chefhub.dev — recipe parsing</div>
                <h3>Paste any recipe. Get structured data.</h3>
                <p>Chefs paste raw recipe text — copied from a blog, a notebook, anywhere — and <strong>Claude Haiku</strong> parses it into structured JSON: ingredients, quantities, steps, and timing, ready to render as a recipe card.</p>
                <div className="showcase-flow mono">
                  <span>Pasted text</span><span className="arrow">→</span><span className="model">Claude Haiku</span><span className="arrow">→</span><span>Structured recipe</span>
                </div>
              </div>
              <div className="showcase-visual">
                <div className="visual-card card-code static">
                  <div className="header"><span></span><span></span><span></span></div>
                  <div className="mini-label">// input</div>
                  <div className="dim">"2 cups flour, 1 tsp<br />salt, cream butter &amp;<br />sugar... bake at 350<br />for 25 min"</div>
                  <div className="mini-label">// output</div>
                  <div><span className="keyword">{"{"}</span></div>
                  <div>&nbsp;&nbsp;<span className="string">"ingredients"</span>: [...],</div>
                  <div>&nbsp;&nbsp;<span className="string">"steps"</span>: [...],</div>
                  <div>&nbsp;&nbsp;<span className="string">"bake_time"</span>: <span className="string">"25min"</span></div>
                  <div><span className="keyword">{"}"}</span></div>
                </div>
              </div>
            </div>

            <div className="showcase-item reveal reverse">
              <div className="showcase-text">
                <div className="showcase-tag">// chefhub.dev — chef recruitment</div>
                <h3>Vetting applicants without a human on every call.</h3>
                <p>New chef applicants record a short intro via an automated <strong>Bland.ai</strong> voice call. The call gets an AI score, a <strong>Checkr</strong> background check runs in parallel, and both feed a single approval queue.</p>
                <div className="showcase-flow mono">
                  <span>Applicant call</span><span className="arrow">→</span><span className="model">AI score</span><span className="arrow">→</span><span>+ Checkr check</span><span className="arrow">→</span><span>Approval queue</span>
                </div>
              </div>
              <div className="showcase-visual">
                <div className="visual-card card-code static">
                  <div className="header"><span></span><span></span><span></span></div>
                  <div><span className="comment">// chef_recruit.pipeline()</span></div>
                  <div>applicant.<span className="keyword">submit</span>()</div>
                  <div>→ bland_ai.call() &nbsp;<span className="string">[ok]</span></div>
                  <div>→ ai.score() &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="string">92/100</span></div>
                  <div>→ checkr.check() &nbsp;<span className="string">[clear]</span></div>
                  <div>→ status: <span className="string">"approved"</span></div>
                </div>
              </div>
            </div>

            <div className="showcase-item reveal">
              <div className="showcase-text">
                <div className="showcase-tag">// tech-garden — plant diagnosis</div>
                <h3>A photo in, a diagnosis out.</h3>
                <p>Press the button on the glasses to photograph a struggling plant. The image ships to the backend, <strong>Claude Vision</strong> analyzes it, and the diagnosis lands in the plant's history on the phone app — analysis is optional, so photos still save fine without it.</p>
                <div className="showcase-flow mono">
                  <span>Glasses photo</span><span className="arrow">→</span><span className="model">Claude Vision</span><span className="arrow">→</span><span>Diagnosis in app</span>
                </div>
              </div>
              <div className="showcase-visual">
                <div className="visual-card card-code static">
                  <div className="header"><span></span><span></span><span></span></div>
                  <div><span className="comment">// glasses.capture()</span></div>
                  <div>photo.<span className="keyword">upload</span>()</div>
                  <div>→ claude.vision(photo)</div>
                  <div>→ diagnosis:</div>
                  <div>&nbsp;&nbsp;<span className="string">"early signs of</span></div>
                  <div>&nbsp;&nbsp;<span className="string">powdery mildew"</span></div>
                  <div>→ app.notify(owner)</div>
                </div>
              </div>
            </div>

            <div className="showcase-item reveal reverse">
              <div className="showcase-text">
                <div className="showcase-tag">// quiet trader — nightly leaderboard</div>
                <h3>Ranked by results, not by who paid.</h3>
                <p>Every night, <strong>Claude Sonnet</strong> scans the public performance of every published alert on the platform and re-ranks the leaderboard. No paid placement — the ranking is the AI's read of what's actually working.</p>
                <div className="showcase-flow mono">
                  <span>Alert performance</span><span className="arrow">→</span><span className="model">Claude Sonnet</span><span className="arrow">→</span><span>Ranked leaderboard</span>
                </div>
              </div>
              <div className="showcase-visual">
                <div className="visual-card card-code static">
                  <div className="header"><span></span><span></span><span></span></div>
                  <div><span className="comment">// leaderboard.nightly_scan()</span></div>
                  <div>alerts.<span className="keyword">fetch_performance</span>()</div>
                  <div>→ claude.rank(alerts)</div>
                  <div>→ leaderboard.update()</div>
                  <div>→ top: <span className="string">"cash_in_out_v3"</span></div>
                  <div>&nbsp;&nbsp;<span className="string">+18.4% (90d)</span></div>
                </div>
              </div>
            </div>

            <div className="showcase-item reveal">
              <div className="showcase-text">
                <div className="showcase-tag">// quiet trader — backtest builder</div>
                <h3>Describe a strategy. Get a formula.</h3>
                <p>Users describe a strategy in plain terms and <strong>Claude</strong> turns it into a custom entry/exit formula, evaluated by a secure recursive-descent parser — no <code>eval()</code> — then run against historical data.</p>
                <div className="showcase-flow mono">
                  <span>Strategy description</span><span className="arrow">→</span><span className="model">Claude</span><span className="arrow">→</span><span>Formula + backtest</span>
                </div>
              </div>
              <div className="showcase-visual">
                <div className="visual-card card-code static">
                  <div className="header"><span></span><span></span><span></span></div>
                  <div><span className="comment">// backtest.ai_formula()</span></div>
                  <div>user.<span className="keyword">describe</span>(strategy)</div>
                  <div>→ claude.parse(strategy)</div>
                  <div>→ formula:</div>
                  <div>&nbsp;&nbsp;<span className="string">"RSI(14) &lt; 30 AND</span></div>
                  <div>&nbsp;&nbsp;<span className="string">SMA(20) &gt; SMA(50)"</span></div>
                  <div>→ backtest.run(formula)</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="contact" id="contact" aria-labelledby="contact-heading">
          <div className="section-header reveal">
            <div className="section-num">04 / Contact</div>
            <h2 id="contact-heading">Let's <span className="italic">build</span> something.</h2>
          </div>

          <div className="contact-grid">
            <div className="contact-info reveal">
              <p>
                Whether you're scoping a custom AI build, need precision machining, or just want to see if there's a fit — we'd like to hear about it.
              </p>
              <div className="contact-detail">
                <span className="label">Email</span>
                <span>hello@binarytimber.com</span>
              </div>
              <div className="contact-detail">
                <span className="label">Hours</span>
                <span>Mon–Fri // 9–6 ET</span>
              </div>
              <div className="contact-detail">
                <span className="label">Entity</span>
                <span>Binary Timber Holdings, LLC</span>
              </div>
            </div>

            <ContactForm />
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-main">
          <div>© 2026 Binary Timber Holdings, LLC</div>
          <div>// All rights reserved</div>
        </div>
        <div className="footer-meta">
          <span>// built with Claude AI</span>
          <span className="footer-dot">·</span>
          <span>deployed free on Vercel</span>
          <span className="footer-dot">·</span>
          <span>$13.17 total (domain, 1 yr)</span>
          <span className="footer-dot">·</span>
          <a href="https://github.com/nick-m-wight/binary-timber" target="_blank" rel="noopener noreferrer" className="footer-github">↗ view source</a>
        </div>
      </footer>
    </>
  );
}
