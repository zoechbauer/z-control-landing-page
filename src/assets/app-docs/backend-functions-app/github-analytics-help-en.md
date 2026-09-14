# GitHub Analytics

This screen shows the traffic data for a GitHub repository, as provided by GitHub under **Insights → Traffic**.

* **Views/Visitors** shows how often the repository page was opened.

* **Unique visitors** shows how many different visitors opened the repository page.

* **Clones/Downloads** shows how often the repository was cloned to a local machine or downloaded.

* **Unique Clones/Downloads** shows how many different people or sources cloned/downloaded the repository.

## How to read the values

* **Total** counts all recorded actions.

* **Unique** counts each person or source only once within the respective period.

* The values for Views/Visitors and Clones/Downloads cannot be directly compared, because GitHub tracks these types of activity differently.

  For **Clones**, GitHub counts complete clone operations rather than individual **fetches**. The traffic data is also recorded using the **UTC+0** time zone.

### Example

For **June 26, 2026**, the following values were shown for the **z-control-landing-page** repository:

* **Clones: 8**
* **Unique clones: 5**
* **Views: 5**
* **Unique visitors: 2**

This means that the repository was cloned/downloaded **8 times by 5 different sources**. The repository page was opened **5 times by 2 different visitors**.

### Another example

For **June 21, 2026**, the following values were shown for the **z-control-landing-page** repository:

* **Clones: 34**
* **Unique clones: 13**
* **Views: 8**
* **Unique visitors: 1**

Here, the cloning activity is significantly higher, even though the repository page was opened by only **one visitor**.

This is entirely possible. For example, **scripts, CI jobs, or other automated tools** may clone a repository without anyone opening its repository page in a browser.

Therefore, **Unique clones** does not necessarily represent individual people only. GitHub may distinguish different users or sources, for example, based on a **username or IP address**.
