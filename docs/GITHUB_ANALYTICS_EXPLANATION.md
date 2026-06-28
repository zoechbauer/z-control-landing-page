# GitHub Analytics Explanation

This page shows GitHub repository traffic from **Insights → Traffic**. It helps you understand how often z-control repositories are viewed and cloned, and whether the activity comes from a few people or from many different sources.

GitHub shows two kinds of data:

- **Views / Visitors**: how often the repository page was opened.
- **Clones**: how often the repository was copied to a local machine.

For both, GitHub shows:

- **Total count** = all events combined.
- **Unique count** = how many different people or sources caused those events.

GitHub’s traffic graph is based on **full clones, not fetches**, and traffic data is shown in **UTC+0**. The clone and visitor numbers update hourly.

---

## At a glance

| Metric | &nbsp; &nbsp; &nbsp; &nbsp; | What it means |
|---|---:|---|
| **Views** | &nbsp; &nbsp; &nbsp; &nbsp; | Total number of repository page visits |
| **Unique visitors** | &nbsp; &nbsp; &nbsp; &nbsp; | Number of different visitors who opened the repo page |
| **Clones** | &nbsp; &nbsp; &nbsp; &nbsp; | Total number of repository clone actions |
| **Unique clones** | &nbsp; &nbsp; &nbsp; &nbsp; | Number of different users or machines that cloned the repo |

A simple rule of thumb:

- **Total** = all actions.
- **Unique** = distinct people or sources.

---

## Views and unique visitors

### Views
A **view** is counted every time someone opens the repository page. If the same person visits the repo 3 times, GitHub counts **3 views**.

### Unique visitors
A **unique visitor** is counted once per person/source in the time period shown. If the same person opens the repo 3 times, GitHub still counts only **1 unique visitor**.

### Example
If two people open the repo like this:

- Person A opens it 3 times.
- Person B opens it 2 times.

Then GitHub shows:

- **Views: 5**
- **Unique visitors: 2**

---

## Clones and unique clones

### Clones
A **clone** is counted each time the repository is copied to a local machine, for example with `git clone`.

### Unique clones
A **unique clone** counts how many different users or machines cloned the repository at least once. If the same person clones from laptop and desktop, that may count as **2 unique clones** depending on how GitHub identifies the source. GitHub and community explanations describe unique cloners as distinct users, usually determined by username or IP address.

### Example
If cloning happens like this:

- Laptop clones once.
- Desktop clones once.
- CI server clones twice.

Then GitHub may show:

- **Clones: 4**
- **Unique clones: 3**

---

## Why the numbers do not always match

It is completely normal for the four numbers to differ. GitHub’s clone and visitor tracking use different signals, so one does not imply the other. A repository can be cloned without a normal page visit, and a page can be visited many times without any clone. GitHub also notes that some traffic can come from automated tooling or services rather than a human browsing the repo.

So do **not** expect this rule:

```txt
unique visitors >= unique clones
```

That is not guaranteed.

---

## Real examples

### Example 1

For **26.6.2026 in repository z-control-landing-page**, you see:

| Metric | Value |
|---|---:|
| Clones | 8 |
| Unique clones | 5 |
| Views | 5 |
| Unique visitors | 2 |

A human-friendly reading is:

- The repo was cloned **8 times** in total.
- Those clones came from **5 different users or machines**.
- The repository page was opened **5 times** in total.
- Those views came from **2 different visitors**.

In plain language, this means a small number of people or sources interacted with the repo repeatedly.

### Example 2

For **21.6.2026 in repository z-control-landing-page**, you see:

| Metric | Value |
|---|---:|
| Clones | 34 |
| Unique clones | 13 |
| Views | 8 |
| Unique visitors | 1 |

A human-friendly reading is:

- The repo was cloned **34 times** in total.
- Those clones came from **13 different users or machines**.
- The repository page was opened **8 times** in total.
- Those views came from **1 single visitor**.

In plain language, this strongly suggests that the repo was accessed mostly through cloning, while only one visitor opened the repository page. That can happen with automation, CI jobs, scripts, or repeated work from a small set of sources.

---

## How to read the graph

A good way to interpret the charts is:

- **Clones** tells you how often the code was copied locally.
- **Unique clones** tells you how many different sources were involved.
- **Views** tells you how often people opened the repo page.
- **Unique visitors** tells you how many different people opened it.

If you see **high clones but low visitors**, that often means automated tools, scripts, CI jobs, or direct clone links are involved. GitHub community discussions note that cloning can be triggered without a normal page visit, and some clone activity may come from automation or services that monitor repositories. 

---

## Notes and limitations

GitHub traffic data is useful, but it is not perfect analytics. The numbers are approximate and may vary depending on how GitHub identifies visitors or clone sources. GitHub also does not provide a detailed breakdown of who exactly made the traffic in the traffic graph itself. 

Treat the metrics as a **signal of activity**, not as exact human-only analytics.

---

## Quick summary

- **Views** = total repo page opens.
- **Unique visitors** = different people who opened the page.
- **Clones** = total repo copy actions.
- **Unique clones** = different users or machines that cloned it.
- Differences between the numbers are normal.
- Bots, scripts, and CI can contribute to clone activity.