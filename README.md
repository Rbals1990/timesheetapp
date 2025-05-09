# Timesheetapp

Timesheetapp is een webapplicatie waarmee gebruikers hun gewerkte uren per week kunnen registreren, berekenen en exporteren naar een Excel-bestand. De applicatie ondersteunt een eenvoudige interface voor het invoeren van uren per dag en biedt een overzicht van het totaal aantal gewerkte uren, inclusief overuren of onderuren ten opzichte van een contractaantal. Daarnaast kunnen gebruikers hun gegevens per e-mail verzenden.

## Kenmerken

- **Urenregistratie per dag:** Gebruikers kunnen hun gewerkte uren per dag invoeren, inclusief start- en eindtijd, pauze en reistijd.
- **Automatische berekeningen:** De app berekent automatisch de gewerkte uren per dag en het totaal aantal gewerkte uren voor de week, inclusief overuren of onderuren ten opzichte van het contract.
- **Excel-export:** De gebruiker kan de geregistreerde uren exporteren naar een Excel-bestand, inclusief alle ingevoerde gegevens en berekeningen.
- **E-mailgeneratie:** Na het indienen van de uren wordt het standaard e-mailprogramma van de gebruiker geopend, met een gegenereerd e-mailbericht en de mogelijkheid om het Excel-bestand bij te voegen.
- **Weekoverzicht:** Gebruikers kunnen hun ingediende uren terugvinden in een overzicht van de week.

## Installatie

Volg de onderstaande stappen om de applicatie lokaal te draaien.

### 1. Clone de repository

```bash
git clone https://github.com/Rbals1990/timesheetapp.git
cd timesheetapp
```

### 2. Installeer de afhankelijkheden

Zorg ervoor dat je [Node.js](https://nodejs.org/) geïnstalleerd hebt. Installeer vervolgens de benodigde afhankelijkheden:

```bash
npm install
```

### 3. Start de development server

De applicatie bestaat uit twee delen: de frontend en de backend.

#### Start de frontend

De frontend draait op poort 5173. Gebruik het volgende commando om de development server te starten:

```bash
npm run dev
```

De frontend is nu toegankelijk op [http://localhost:5173](http://localhost:5173).

#### Start de backend

De backend draait op poort 5000 en maakt gebruik van een JSON-database die wordt gestart met Express.js. Start de backend server met het volgende commando:

```bash
npm run api
```

De backend is nu toegankelijk op [http://localhost:5000](http://localhost:5000).

## Functionaliteit

### Urenregistratie

De gebruiker kan de volgende gegevens per dag invoeren:

- **Starttijd** en **Eindtijd**: De tijd waarop de gebruiker begint en eindigt met werken.
- **Pauze**: De pauze die de gebruiker heeft genomen (in minuten).
- **Reistijd**: De tijd die de gebruiker onderweg is naar het werk of andere locaties (in minuten).

Op basis van deze gegevens berekent de app automatisch het aantal gewerkte uren per dag en de totale gewerkte uren voor de week.

### Excel-export

De gebruiker kan de ingevulde uren per week exporteren naar een Excel-bestand. Het bestand bevat:

- De ingevulde gegevens per dag (dag, starttijd, eindtijd, pauze, reistijd, gewerkte uren).
- Een totaal van de gewerkte uren en het verschil met het contractaantal uren (overuren of onderuren).
- Eventuele opmerkingen van de gebruiker.

### E-mailgeneratie

Na het indienen van de uren wordt het standaard e-mailprogramma van de gebruiker geopend, met een gegenereerd e-mailbericht. Het e-mailbericht bevat:

- Het onderwerp met het weeknummer, het jaar en de naam van de gebruiker.
- De mogelijkheid om het gegenereerde Excel-bestand toe te voegen aan de e-mail.

### Weekoverzicht

Gebruikers kunnen een overzicht van de ingediende uren voor de week inzien. Dit overzicht toont alle geregistreerde gegevens per dag en het totaal aantal gewerkte uren.

## Technologieën

- **React**: Frontend framework voor het bouwen van de gebruikersinterface.
- **TypeScript**: Typencontrole en statische analyse voor de frontend en backend.
- **Express.js**: Backend framework voor het beheer van API-aanvragen en de JSON-database.
- **XLSX**: Bibliotheek voor het genereren van Excel-bestanden.
- **FileSaver.js**: Gebruikt voor het downloaden van bestanden (Excel-export).
- **JSON-database**: Simpele JSON-gebaseerde database voor het opslaan van ingediende uren.

## Contributie

Wil je bijdragen aan dit project? Hier is hoe je dat kunt doen:

1. Fork de repository.
2. Maak een nieuwe branch voor jouw feature (`git checkout -b feature-naam`).
3. Commit je wijzigingen (`git commit -am 'Voeg nieuwe feature toe'`).
4. Push naar je branch (`git push origin feature-naam`).
5. Maak een pull request.

## License

Dit project is gelicentieerd onder de MIT License - zie de [LICENSE](LICENSE) bestand voor details.
