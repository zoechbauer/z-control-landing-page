## GitHub Analytics

This screen shows GitHub repository traffic from **Insights → Traffic**.

- **Views** = how often the repository page was opened.
- **Unique visitors** = how many different people opened it.
- **Clones** = how often the repository was copied to a local machine.
- **Unique clones** = how many different people or machines cloned it.

### How to read it

- **Total** counts every action.
- **Unique** counts each person or source only once.
- The numbers do not always match, because views and clones are tracked differently. GitHub shows **full clones, not fetches**, and the traffic data uses **UTC+0**. [web:13]

### Example

For **26.6.2026** in **z-control-landing-page**:

- **Clones: 8**
- **Unique clones: 5**
- **Views: 5**
- **Unique visitors: 2**

This means the repo was cloned 8 times by 5 different sources, and the repo page was opened 5 times by 2 different visitors.

### Another example

For **21.6.2026** in **z-control-landing-page**:

- **Clones: 34**
- **Unique clones: 13**
- **Views: 8**
- **Unique visitors: 1**

This suggests a lot of cloning activity, but only one visitor opened the repo page. That can happen with scripts, CI jobs, or other automated tools. GitHub community discussions note that unique cloners are distinct users or sources, often identified by username or IP address. [web:10][web:3]