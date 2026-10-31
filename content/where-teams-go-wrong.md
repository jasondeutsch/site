# Where teams go wrong with AI engineering

![Article topic map summarizing the main topics and practical decisions.](writing/eng/posts/where%20teams%20go%20wrong/images/article-overview.png)

[Figure notes](writing/eng/posts/where%20teams%20go%20wrong/images/Figure%20sources.md)

## Key points

- AI tools can increase coding output, but evidence for sustained, meaningful gains across software delivery remains mixed and incomplete.
- Positive field experiments show more completed tasks. Other research finds smaller gains at release or increased review and rework elsewhere.
- The research doesn't establish that most teams have negative ROI. Faster coding alone doesn't establish a positive return either.
- Teams go wrong when they underestimate the learning required, count code volume as value, and leave the delivery process unchanged.
- Weak guidance and verification can shift costs onto reviewers and maintainers, hiding them from productivity reports.
- Leaders should fund learning and address delivery constraints. Measure useful software delivered, total cost, quality, and developer experience through release and maintenance.
- Establishing best practices around the AI Engineering systems is key to unlocking value.

---

Software teams are under pressure to show that AI is making them more productive. The easiest evidence to produce is more code. Whether that code leads to better software, delivered at lower cost, is a harder question, and the research gives us much less certainty than the adoption push suggests.

There are credible gains. Randomized field experiments covering 4,867 developers found a pooled 26.08% increase in completed tasks. A separate observational study found large increases in coding activity but much smaller gains in releases. Both results deserve attention. Neither establishes how much value a team gets after paying for review, rework, and ongoing maintenance. [Management Science](https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535), [Writing Code vs. Shipping Code](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6859839)

For teams maintaining existing products, a meaningful productivity gain has to survive that whole process. It should let them deliver useful changes sooner or with less effort, without leaving an expensive cleanup job. Much of the research measures a narrower outcome. Anecdotes about saving hours on a task rarely account for what happened after the code was written.

The evidence doesn't support claiming that most teams have negative ROI. It does leave the case for broad, sustained gains unresolved. My concern is that teams are treating those gains as a given while underinvesting in the work required to achieve them. They hand engineers new tools, keep the same delivery process, and count the extra output as progress.

That is where teams go wrong.

## Underestimating the learning curve

Software engineers are used to having homework. A new framework arrives, infrastructure changes, or a library they depend on needs replacing. Keeping up takes time, much of which never appears in a project estimate.

AI adds another subject to learn. A license and an introductory demonstration barely get an engineer started.

Using an agent well requires understanding what context it has and where that context falls short. An engineer needs to know what the agent can do in the environment, how to break down a task, and when to stop a promising approach that is going wrong. The agent's confidence is no help here. A wrong assumption can produce perfectly readable code.

Barke, James, and Polikarpova's qualitative study of 20 programmers describes two modes of working with Copilot: acceleration, when the programmer knows what to do, and exploration, when they use the tool to examine possible approaches. The distinction helps explain why knowing how to request code is only part of the skill. An engineer also has to judge what the proposed approach gets right. The study describes behavior rather than proving a particular training method improves productivity. [Grounded Copilot](https://arxiv.org/abs/2206.15000)

Take a permissions bug. An agent might change a check and add a test that passes. The engineer still has to establish whether that check is the actual authorization boundary. Perhaps another path reaches the same data. Perhaps the test uses an account that could already perform the action. Reading the diff is only part of understanding the fix.

A rollout that consists of enabling accounts and telling everyone to use them leaves engineers to discover these problems on their own. Leadership may see adoption while the team sees another demand on an already full week.

Give people time to practice on work that resembles their actual jobs. Have them compare results and examine the failures. An internal example is much more useful when it includes the bad first attempt, the missing context, and the check that caught the mistake. That's the material an engineer can apply to the next task.

Expecting people to learn all of this after hours also hides part of the investment. The learning cost exists whether the organization budgets for it or not.

A two-year field study described by MIT Sloan makes that hidden work explicit. Researchers studying a medical center and a law firm found that continued AI experimentation depended on support for the people testing and refining solutions. These weren't software teams, and the cases don't establish a financial return. They do offer a useful warning about expecting adoption to sustain itself on top of everyone's existing job. [MIT Sloan](https://mitsloan.mit.edu/press/why-some-organizations-turn-ai-experiments-business-value-while-others-quietly-fail)

## Counting output as value

Productivity is output relative to inputs. The trouble starts with the definition of output.

A business gets no automatic benefit from a larger codebase. Every addition creates something else to understand and maintain. The feature may justify that cost; the number of lines tells us very little about whether it does.

Imagine a factory doubling its widget production. Before celebrating, you'd want to know whether anyone is buying the extra widgets. You'd also check the defect rate and the cost of getting each one through inspection and into a customer's hands. A warehouse full of unsold inventory is an expensive result.

Software teams can accumulate inventory too. Pull requests wait for review. Features reach production and go unused. An unnecessary abstraction becomes part of the system, and future engineers have to understand why it's there. AI lowers the effort required to create these things.

Demirer, Musolff, and Yang examine this gap in *Writing Code vs. Shipping Code*. The September 2026 revision of their working paper describes more than 500,000 GitHub developers. Across successive generations of AI tools, the reported cumulative increase in commits reaches 240%, while the increase in releases is 30%. The study uses a matched event-study design rather than randomized assignment. Even with that limitation, the difference between activity and delivered output deserves attention. [Paper record](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6859839)

Thirty percent more releases could be a meaningful improvement. It would be a mistake to dismiss it just because the coding figure is larger. But releases alone don't tell us whether users benefited or whether the extra output justified its full cost. That's the missing step in many productivity claims.

Tokens are an even less useful measure of productivity. They tell you something about consumption and cost. A million tokens might produce a useful feature or a long detour through the wrong solution.

I'd rather know what reached users, whether it helped them, and what the team spent getting it there. A small fix can be worth more than a large feature. Discovering that a proposed feature doesn't need to be built can be worth more than either.

## Leaving the process untouched

"Just use AI" leaves a lot for the team to figure out.

If engineers spend much of the week waiting for requirements or release decisions, faster coding won't remove those delays. It can give them more finished implementation work to wait on.

Suppose a team can now prepare changes twice as quickly, while review capacity stays the same. The queue grows. Engineers keep several pending changes in their heads, answer questions about last week's work, and resolve conflicts with changes that landed in the meantime. Reviewers have more to read. The team spends some of its new capacity managing the backlog it just created.

Before expanding output, follow a few ordinary changes through the process. Where did they wait? What had to be redone? Which decision took three meetings, and why? These questions give the team somewhere specific to apply the tools.

A prototype might settle a requirement before anyone commits to an implementation. Better test environments might make verification faster. A clearer description of a change might save a reviewer from reconstructing the intent. Code generation deserves a place in that discussion, alongside the other work that holds up delivery.

The team also needs to decide how much work to start. Faster implementation can be a reason to make smaller changes and finish them sooner. Filling every available hour with another task can leave everyone busier without getting much more released.

Brynjolfsson, Rock, and Syverson's research on the productivity J-curve offers an economic explanation for the investment this requires. General-purpose technologies depend on complementary changes to processes and human capital, and those investments can delay measured gains. It's a framework for understanding adoption costs, not a promise that every disappointing rollout will eventually pay off. A team still needs evidence that its process changes are helping. [American Economic Journal: Macroeconomics](https://doi.org/10.1257/mac.20180386)

## Expecting the tool to supply the workflow

A coding assistant can be useful immediately. Getting consistent results across a team takes some setup and continued attention.

An agent working in an established service needs to find the build commands and understand the rules that matter in that repository. It needs access to enough context to make a sensible change. The team needs to decide which actions it can take and what checks it must run.

This surrounding setup is often called a harness. It might include repository instructions and reusable skills, along with automated checks and records of what the agent did. The name matters less than whether the setup helps the agent do the actual work.

If the architecture exists mostly in a senior engineer's memory, every task starts with missing information. Someone has to supply it, or the agent guesses. Repeated prompting can become a way of paying to rediscover the same facts.

Completion needs similar care. An agent saying "fixed" gives a reviewer little to work with. A focused diff and evidence that the original failure now passes are more useful. Tests need scrutiny too: a test written from the same mistaken assumption as the implementation can pass while the bug remains.

Perry and colleagues found a related confidence problem in a security-focused user study. Participants using an AI assistant produced less secure code overall while being more likely to believe their code was secure. The experiment used an older model, so it shouldn't be read as a vulnerability estimate for current tools. The lesson for review is narrower: confidence in a generated answer needs an independent check. [ACM CCS 2023 paper](https://arxiv.org/abs/2211.03622)

The amount of structure should fit the task. Editing documentation needs little ceremony. Changing billing behavior or migrating data calls for closer review. You don't need elaborate orchestration to begin, but you do need a clear account of what the agent should do and how someone will check it.

Build that setup around observed failures. If agents repeatedly miss a project convention, document it where they can find it. If a check catches a recurring mistake, make it part of the workflow. Adding another agent is useful when it solves a problem you've actually identified.

![A measurement diagram tracks implementation, review, verification, delivery and maintenance, including failed attempts and total cost.](measurement-boundary.png)

*Proposed measurement boundary informed by [SPACE](https://doi.org/10.1145/3454122.3454124), [Cui et al.](https://pubsonline.informs.org/doi/10.1287/mnsc.2025.00535), and [METR](https://arxiv.org/abs/2507.09089v2). The formula is a cohort-level accounting definition, not an observed result.*

[Figure sources and methodology](writing/eng/posts/where%20teams%20go%20wrong/images/Figure%20sources.md)

## Overlooking where the work goes

"Code was never the bottleneck" is a tempting response to the enthusiasm. It is also too broad. Implementation takes time, and reducing that time can improve delivery.

The size of the improvement depends on how much of the total it accounts for. In a simple example, a change takes two days to code and eight more days to analyze, review, test, and release. Cutting coding time in half reduces the total from ten days to nine. That's a saving worth having, but it's a long way from delivering twice as fast.

Gu and colleagues' research agenda for AI in software engineering covers testing and maintenance as well as code generation. It identifies challenges in codebase understanding, long-term planning, and human–AI collaboration. This is a map of research problems, rather than a productivity experiment, but it makes clear how much engineering remains outside a successful code-generation task. [Challenges and Paths Towards AI for Software Engineering](https://arxiv.org/pdf/2503.22625)

Cheaper implementation changes the balance of effort. Deciding exactly what should happen, and proving that it does, can take a larger share of the work. If the team uses the savings to attempt more changes, it increases the demand for analysis and testing as well.

Consider a requirement that leaves an edge case unspecified. The agent chooses an interpretation and writes tests around it. A reviewer sees code that makes sense and checks that pass. After release, a customer encounters the edge case and gets the wrong result. Now the team has a support issue and another change to deliver. Depending on what happened to the data, it may also have a migration to plan.

Human engineers make these mistakes too. The risk grows when a team generates more changes than it has capacity to examine. Over time, those changes leave behind exceptions and workarounds that make the next task harder. The cleanup bill can arrive well after the productivity report.

Xu and colleagues' observational study of open-source projects offers evidence of this redistribution. Their January 2026 preprint reports that core developers reviewed 6.5% more code after Copilot's introduction while their original coding productivity fell 19%. The authors also report more rework. This doesn't establish lifetime maintenance costs, but it raises a concrete question: whose effort is being counted when a team reports a gain? [Research preprint](https://arxiv.org/abs/2510.10165v3)

The redistribution can also help. Research summarized by MIT's Initiative on the Digital Economy found that Copilot users shifted toward core coding work and away from managerial activity. It also found more independent work. These results complicate the idea that AI simply adds coordination overhead everywhere. The effect depends on what work is displaced, who picks it up, and whether reduced collaboration costs the team useful mentorship or shared understanding. The summary doesn't establish those long-term effects. [MIT research summary](https://ide.mit.edu/insights/beyond-productivity-genai-and-the-changing-nature-of-work/)

Clear acceptance criteria help. So does examining consequential design choices before an agent builds around them. Tests should come from the intended behavior, and production feedback should reach the people making the changes.

Above all, reviewers need time to review. Requiring human approval while scheduling everyone as though generation has removed most of the engineering work is a contradiction the team will eventually pay for.

## What I'd measure

![In one METR study, developers forecast 24 percent less time and estimated 20 percent less time afterward, while measured time increased 19 percent.](perception-versus-time.png)

*Historical findings from [Becker et al., 2025](https://arxiv.org/abs/2507.09089v2); measured interval of +2% to +39% reported in [METR's 2026 follow-up](https://metr.org/blog/2026-02-24-uplift-update/). Forecasts are participant estimates, not measured effects. The follow-up cautions against generalizing the older result to current tools.*

[Figure sources and methodology](writing/eng/posts/where%20teams%20go%20wrong/images/Figure%20sources.md)

Start with a problem specific enough to evaluate. Perhaps a recurring maintenance task costs too much, or a class of changes takes too long to release. Establish what it costs today, then try the tools on representative work.

Follow the work through release. Count the time spent learning and configuring the tool, as well as the effort to review and correct its output. Keep watching after deployment: an immediate saving can be followed by defects or extra maintenance. A short experiment won't answer every question about long-term returns, but it can expose costs that a coding demonstration misses.

Measure the time instead of relying entirely on how fast the work felt. METR's early-2025 randomized trial involved 16 experienced developers completing 246 tasks in repositories they knew well. With AI access, tasks took 19% longer, although developers believed afterward that AI had made them faster. This was a small study of particular tools and projects, not a verdict on AI coding. [METR paper](https://arxiv.org/abs/2507.09089)

The follow-up matters too. In February 2026, METR reported that developers likely benefited more from newer tools, but selection effects and difficulty measuring time made the new estimates unreliable. That leaves both blanket optimism and blanket pessimism on uncertain ground. It also shows why anecdotes about speed, however sincere, need careful measurement behind them. [METR follow-up](https://metr.org/blog/2026-02-24-uplift-update/)

Time to a verified release is a useful starting point. Review queues and rework help explain it. User feedback tells you whether the delivered change was worth the effort. Together, these tell a team more than token usage or generated lines.

The SPACE framework gives this approach a broader foundation. Forsgren and colleagues argue that developer productivity can't be captured by a single activity metric. Their framework includes collaboration and developer well-being alongside performance and flow. A workflow that makes work less exhausting may have benefits worth measuring, even before those benefits appear as more releases. [ACM Queue](https://doi.org/10.1145/3454122.3454124)

I think the tools are worth learning. The positive field experiments give us reasons to invest, and the mixed results give us reasons to measure. Much of the research and anecdotal evidence still falls short of demonstrating sustained gains that survive review, deployment, and maintenance. Teams should treat that gap as a question to answer in their own work.

But when a team reports that it can produce twice as much code, I'd still want to know what happened to the review queue, what reached customers, and who is maintaining the result six months later. Those answers belong in the return calculation.

---

### Editorial notes

- The article replaces the claim that most teams have negative ROI with an assessment of the evidence for sustained gains across delivery and maintenance. This is the author's interpretation of the collected sources, not a quantified finding about most research or most organizations.
- The Reuters investigation linked in the outline could not be opened directly during the original research. Verify it before adding a Meta example; this draft uses no claims from that investigation.
- The coding-versus-shipping figures use the September 2026 revised paper record, replacing the figures from the earlier MIT Sloan summary.
- The timing example is illustrative. The practical recommendations and failure scenarios are the article's analysis, rather than findings attributed to the cited sources.

Reference to verify: [Reuters: Mark Zuckerberg had a bold plan to replace Meta staff with AI. Here's how it imploded.](https://www.reuters.com/investigations/mark-zuckerberg-had-bold-plan-replace-meta-staff-with-ai-heres-how-it-imploded-2026-08-26/)
