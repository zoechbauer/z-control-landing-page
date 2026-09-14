# GitHub Analytics

Diese Ansicht zeigt die Traffic-Daten eines GitHub-Repositories, wie sie unter **Insights → Traffic** von GitHub bereitgestellt werden.

* **Views/Visitors** zeigt, wie oft die Repository-Seite aufgerufen wurde.

* **Unique Views/Visitors** zeigt, wie viele unterschiedliche Besucher die Repository-Seite aufgerufen haben.

* **Clones/Downloads** zeigt, wie oft das Repository auf eine lokale Maschine geklont/heruntergeladen wurde.

* **Unique Clones/Downloads** zeigt, wie viele unterschiedliche Personen oder Quellen das Repository geklont/heruntergeladen haben.

## So lassen sich die Werte verstehen

* **Gesamt** zählt alle erfassten Aktionen.

* **Unique** zählt eine Person bzw. Quelle innerhalb des jeweiligen Zeitraums nur einmal.

* Die Werte von Views/Visitors und Clones/Downloads lassen sich nicht direkt miteinander vergleichen, da GitHub beide Arten von Zugriffen unterschiedlich erfasst.

  Bei **Clones** zählt GitHub vollständige Klonvorgänge und keine einzelnen **Fetches**. Die Traffic-Daten werden außerdem in der Zeitzone **UTC+0** erfasst.

### Beispiel

Für den **26.6.2026** im Repository **z-control-landing-page** wurden folgende Werte angezeigt:

* **Clones: 8**
* **Unique clones: 5**
* **Views: 5**
* **Unique visitors: 2**

Das bedeutet: Das Repository wurde insgesamt **8-mal von 5 unterschiedlichen Quellen** geklont/heruntergeladen. Die Repository-Seite wurde **5-mal von 2 unterschiedlichen Besuchern** aufgerufen.

### Ein weiteres Beispiel

Für den **21.6.2026** im Repository **z-control-landing-page** wurden folgende Werte angezeigt:

* **Clones: 34**
* **Unique clones: 13**
* **Views: 8**
* **Unique visitors: 1**

Hier ist eine deutlich höhere Clone-Aktivität zu erkennen, obwohl die Repository-Seite nur von **einem Besucher** aufgerufen wurde.

Das ist durchaus möglich. Beispielsweise können **Skripte, CI-Jobs oder andere automatisierte Tools** ein Repository klonen/runterladen, ohne dass dabei jemand die Repository-Seite im Browser öffnet.

Auch bei **Unique clones** muss es sich daher nicht ausschließlich um einzelne Personen handeln. GitHub kann unterschiedliche Benutzer bzw. Quellen beispielsweise anhand eines **Benutzernamens oder einer IP-Adresse** unterscheiden.
