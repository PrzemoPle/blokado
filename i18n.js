// ================= I18N =================
const CREDIT_LINK = ' <a href="mailto:przemyslaw@plewinski.pl">przemyslaw@plewinski.pl</a> ';
const CC_LINK = '<a href="https://claude.com/claude-code" target="_blank" rel="noopener">Claude Code</a>';

const I18N = {
  pl: {
    score:'Wynik', best:'Rekord', colorbar:'Pasek koloru', board:'Plansza',
    nofit:'nie pasuje', gameOver:'Koniec gry',
    gameOverWhy:'Żaden z klocków nie mieści się już na planszy',
    points:'punktów', newRecord:'Nowy rekord!', again:'Zagraj ponownie',
    copyResult:'Skopiuj wynik', copied:'Skopiowano!', backToMenu:'Menu główne',
    menuSub:'wybierz tryb gry',
    modeSimple:'Tryb prosty', modeSimpleD:'Klasyczna, czysta plansza. Idealna na start.',
    modeAdv:'Tryb zaawansowany', modeAdvD:'Plansze z kamieniami, polami premiowymi i lodem.',
    modeDaily:'Wyzwanie dnia', modeDailyD:'Jedno rozdanie dziennie - takie samo dla wszystkich. Porównaj wynik!',
    howto:'Jak grać?', skip:'Pomiń', next:'Dalej', play:'Graj!', done:'Gotowe',
    floats:['Dobrze!','Świetnie!','Wow!','Niesamowite!'],
    mono:'Jeden kolor!', gold:'Złoto!', rotGain:'+1 obrót!', boom:'Bum!',
    layouts:['klasyczna','gwiezdna','kamienne narożniki','wyspa','filary'],
    rotUnlockTip:'Odblokuj obracanie (zużywa 1 żeton)', rotFreeTip:'Obracaj do woli',
    rotate:'Obróć', rotateFree:'Obróć ∞',
    install:'Zainstaluj jako aplikację', installTitle:'Zainstaluj Blokado', installNow:'Zainstaluj', close:'Zamknij',
    installedNote:'Gra działa już jako zainstalowana aplikacja.',
    instIntro:{ios:'Na iPhonie i iPadzie instalujesz z Safari:', android:'Na Androidzie:', desktop:'Na komputerze:'},
    instNotSafari:'Otwórz tę stronę w Safari - inne przeglądarki na iOS nie zawsze pozwalają dodać aplikację.',
    instSteps:{
      ios:['Dotknij przycisku <b>Udostępnij</b> <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M8 7l4-4 4 4"/><path d="M5 12v8h14v-8"/></svg> na dolnym pasku Safari.','Przewiń listę i wybierz <b>Dodaj do ekranu początkowego</b>.','Potwierdź przyciskiem <b>Dodaj</b>. Ikona Blokado pojawi się na ekranie głównym.'],
      androidNative:['Dotknij <b>Zainstaluj</b> poniżej i potwierdź. Aplikacja pojawi się na ekranie głównym.'],
      android:['Otwórz menu przeglądarki <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg> w prawym górnym rogu.','Wybierz <b>Dodaj do ekranu głównego</b> lub <b>Zainstaluj aplikację</b>.','Potwierdź. Ikona Blokado pojawi się na ekranie głównym.'],
      desktopNative:['Kliknij <b>Zainstaluj</b> poniżej i potwierdź. Blokado otworzy się w osobnym oknie.'],
      desktop:['Chrome / Edge: kliknij ikonę instalacji po prawej stronie paska adresu albo menu <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg> → <b>Zainstaluj Blokado</b>.','Safari (macOS): menu <b>Plik → Dodaj do Docka</b>.','Firefox nie obsługuje instalacji - użyj Chrome lub Edge.']
    },
    hint:'&#8635; = obrót klocka. 4 linie naraz = +1 obrót. Linia w jednym kolorze ładuje pasek - pełny pasek daje bombę.',
    credits:'Gra stworzona przez' + CREDIT_LINK + 'przy udziale ' + CC_LINK,
    shareText:(d,s)=>'BLOKADO - Wyzwanie dnia '+d+'\nMój wynik: '+s+' pkt \u{1F9E9}',
    tut:[
      {title:'Układaj i czyść linie', text:'Przeciągaj klocki z tacki na planszę. Gdy zapełnisz cały rząd lub kolumnę - linia znika i dostajesz punkty. Gra kończy się, gdy żaden klocek już nie pasuje.'},
      {title:'Obracaj klocki', text:'Masz 3 żetony obrotu &#8635;. Kliknięcie przycisku pod klockiem zużywa żeton i odblokowuje obracanie - potem kręcisz nim do woli, aż go ułożysz. Wyczyszczenie 4 linii naraz zwraca jeden żeton!'},
      {title:'Graj kolorami', text:'Linia w całości w jednym kolorze daje bonus i ładuje pasek koloru pod planszą. Gdy pasek się zapełni, w slocie obok pojawia się bomba - przeciągnij ją na planszę jak zwykły klocek, a wyczyści obszar 3x3 wokół miejsca upuszczenia. Opłaca się planować, gdzie kładziesz który kolor.'},
      {title:'Pola specjalne', text:'&#9733; Gwiazdka - punkty za przykrycie. Złote pole - bonus przy wyczyszczeniu. Lód - trzeba czyścić 2 razy. Kamień (tryb zaawansowany) - nigdy nie znika, buduj wokół niego.'}
    ]
  },
  en: {
    score:'Score', best:'Best', colorbar:'Color bar', board:'Board',
    nofit:'no fit', gameOver:'Game over',
    gameOverWhy:'No piece fits on the board anymore',
    points:'points', newRecord:'New best!', again:'Play again',
    copyResult:'Copy result', copied:'Copied!', backToMenu:'Main menu',
    menuSub:'choose a game mode',
    modeSimple:'Classic mode', modeSimpleD:'A clean, classic board. Perfect to start.',
    modeAdv:'Challenge mode', modeAdvD:'Boards with stones, bonus fields and ice.',
    modeDaily:'Daily challenge', modeDailyD:'One deal per day - the same for everyone. Compare scores!',
    howto:'How to play', skip:'Skip', next:'Next', play:'Play!', done:'Done',
    floats:['Nice!','Great!','Wow!','Amazing!'],
    mono:'One color!', gold:'Gold!', rotGain:'+1 spin!', boom:'Boom!',
    layouts:['classic','starry','stone corners','island','pillars'],
    rotUnlockTip:'Unlock rotation (uses 1 token)', rotFreeTip:'Rotate freely',
    rotate:'Rotate', rotateFree:'Rotate ∞',
    install:'Install as an app', installTitle:'Install Blokado', installNow:'Install', close:'Close',
    installedNote:'The game is already running as an installed app.',
    instIntro:{ios:'On iPhone and iPad you install from Safari:', android:'On Android:', desktop:'On a computer:'},
    instNotSafari:'Open this page in Safari - other iOS browsers do not always allow adding apps.',
    instSteps:{
      ios:['Tap the <b>Share</b> button <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M8 7l4-4 4 4"/><path d="M5 12v8h14v-8"/></svg> in the Safari toolbar.','Scroll the list and choose <b>Add to Home Screen</b>.','Confirm with <b>Add</b>. The Blokado icon will appear on your home screen.'],
      androidNative:['Tap <b>Install</b> below and confirm. The app will appear on your home screen.'],
      android:['Open the browser menu <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg> in the top-right corner.','Choose <b>Add to Home screen</b> or <b>Install app</b>.','Confirm. The Blokado icon will appear on your home screen.'],
      desktopNative:['Click <b>Install</b> below and confirm. Blokado will open in its own window.'],
      desktop:['Chrome / Edge: click the install icon at the right of the address bar, or menu <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg> → <b>Install Blokado</b>.','Safari (macOS): menu <b>File → Add to Dock</b>.','Firefox does not support installing - use Chrome or Edge.']
    },
    hint:'&#8635; = rotate a piece. Clear 4 lines at once = +1 spin. A single-color line charges the bar - a full bar gives you a bomb.',
    credits:'Game created by' + CREDIT_LINK + 'with ' + CC_LINK,
    shareText:(d,s)=>'BLOKADO - Daily challenge '+d+'\nMy score: '+s+' pts \u{1F9E9}',
    tut:[
      {title:'Place blocks, clear lines', text:'Drag pieces from the tray onto the board. Fill a whole row or column and it clears for points. The game ends when no piece fits anymore.'},
      {title:'Rotate your pieces', text:'You have 3 rotation tokens &#8635;. Tapping the button under a piece spends a token and unlocks rotation - then spin it as much as you like until you place it. Clearing 4 lines at once refunds one token!'},
      {title:'Play with colors', text:'A line made of a single color gives a bonus and charges the color bar below the board. When the bar fills up, a bomb appears in the slot next to it - drag it onto the board like a regular piece and it clears the 3x3 area around where you drop it. Planning where each color goes pays off.'},
      {title:'Special fields', text:'&#9733; Star - points for covering it. Gold cell - bonus when cleared. Ice - needs to be cleared twice. Stone (challenge mode) - never clears, build around it.'}
    ]
  },
  de: {
    score:'Punkte', best:'Rekord', colorbar:'Farbleiste', board:'Feld',
    nofit:'passt nicht', gameOver:'Spiel vorbei',
    gameOverWhy:'Kein Block passt mehr auf das Feld',
    points:'Punkte', newRecord:'Neuer Rekord!', again:'Nochmal spielen',
    copyResult:'Ergebnis kopieren', copied:'Kopiert!', backToMenu:'Hauptmenü',
    menuSub:'Spielmodus wählen',
    modeSimple:'Klassischer Modus', modeSimpleD:'Ein sauberes, klassisches Feld. Perfekt für den Einstieg.',
    modeAdv:'Herausforderung', modeAdvD:'Felder mit Steinen, Bonusfeldern und Eis.',
    modeDaily:'Tägliche Challenge', modeDailyD:'Ein Deal pro Tag - für alle gleich. Vergleiche dein Ergebnis!',
    howto:'Wie spielt man?', skip:'Überspringen', next:'Weiter', play:'Spielen!', done:'Fertig',
    floats:['Gut!','Super!','Wow!','Unglaublich!'],
    mono:'Eine Farbe!', gold:'Gold!', rotGain:'+1 Drehung!', boom:'Bumm!',
    layouts:['klassisch','Sternenfeld','Steinecken','Insel','Säulen'],
    rotUnlockTip:'Drehen freischalten (kostet 1 Marke)', rotFreeTip:'Frei drehen',
    rotate:'Drehen', rotateFree:'Drehen ∞',
    install:'Als App installieren', installTitle:'Blokado installieren', installNow:'Installieren', close:'Schließen',
    installedNote:'Das Spiel läuft bereits als installierte App.',
    instIntro:{ios:'Auf iPhone und iPad installierst du aus Safari:', android:'Auf Android:', desktop:'Am Computer:'},
    instNotSafari:'Öffne diese Seite in Safari - andere iOS-Browser erlauben das Hinzufügen nicht immer.',
    instSteps:{
      ios:['Tippe auf <b>Teilen</b> <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M8 7l4-4 4 4"/><path d="M5 12v8h14v-8"/></svg> in der Safari-Leiste.','Scrolle und wähle <b>Zum Home-Bildschirm</b>.','Bestätige mit <b>Hinzufügen</b>. Das Blokado-Symbol erscheint auf dem Home-Bildschirm.'],
      androidNative:['Tippe unten auf <b>Installieren</b> und bestätige. Die App erscheint auf dem Startbildschirm.'],
      android:['Öffne das Browsermenü <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg> oben rechts.','Wähle <b>Zum Startbildschirm hinzufügen</b> oder <b>App installieren</b>.','Bestätige. Das Blokado-Symbol erscheint auf dem Startbildschirm.'],
      desktopNative:['Klicke unten auf <b>Installieren</b> und bestätige. Blokado öffnet sich in einem eigenen Fenster.'],
      desktop:['Chrome / Edge: klicke auf das Installationssymbol rechts in der Adressleiste oder Menü <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg> → <b>Blokado installieren</b>.','Safari (macOS): Menü <b>Ablage → Zum Dock hinzufügen</b>.','Firefox unterstützt keine Installation - nutze Chrome oder Edge.']
    },
    hint:'&#8635; = Block drehen. 4 Linien auf einmal = +1 Drehung. Eine einfarbige Linie lädt die Leiste - volle Leiste gibt eine Bombe.',
    credits:'Ein Spiel von' + CREDIT_LINK + 'mit Unterstützung von ' + CC_LINK,
    shareText:(d,s)=>'BLOKADO - Tägliche Challenge '+d+'\nMein Ergebnis: '+s+' Punkte \u{1F9E9}',
    tut:[
      {title:'Blöcke legen, Linien löschen', text:'Ziehe Blöcke vom Tablett auf das Feld. Eine volle Reihe oder Spalte verschwindet und bringt Punkte. Das Spiel endet, wenn kein Block mehr passt.'},
      {title:'Blöcke drehen', text:'Du hast 3 Dreh-Marken &#8635;. Ein Tipp auf den Knopf unter einem Block kostet eine Marke und schaltet das Drehen frei - dann drehst du ihn beliebig oft, bis du ihn legst. 4 Linien auf einmal geben eine Marke zurück!'},
      {title:'Spiele mit Farben', text:'Eine einfarbige Linie gibt einen Bonus und lädt die Farbleiste unter dem Feld. Ist die Leiste voll, erscheint daneben eine Bombe - ziehe sie wie einen normalen Block aufs Feld, und sie räumt den 3x3-Bereich um die Stelle, wo du sie ablegst. Es lohnt sich zu planen, wohin welche Farbe kommt.'},
      {title:'Spezialfelder', text:'&#9733; Stern - Punkte fürs Abdecken. Goldfeld - Bonus beim Löschen. Eis - muss zweimal gelöscht werden. Stein (Herausforderung) - verschwindet nie, baue drumherum.'}
    ]
  },
  fr: {
    score:'Score', best:'Record', colorbar:'Barre de couleur', board:'Plateau',
    nofit:'ne rentre pas', gameOver:'Partie terminée',
    gameOverWhy:'Plus aucune pièce ne rentre sur le plateau',
    points:'points', newRecord:'Nouveau record !', again:'Rejouer',
    copyResult:'Copier le résultat', copied:'Copié !', backToMenu:'Menu principal',
    menuSub:'choisis un mode de jeu',
    modeSimple:'Mode classique', modeSimpleD:'Un plateau propre et classique. Parfait pour débuter.',
    modeAdv:'Mode défi', modeAdvD:'Des plateaux avec pierres, cases bonus et glace.',
    modeDaily:'Défi du jour', modeDailyD:'Une donne par jour - la même pour tous. Compare ton score !',
    howto:'Comment jouer ?', skip:'Passer', next:'Suivant', play:'Jouer !', done:'Terminé',
    floats:['Bien !','Super !','Wow !','Incroyable !'],
    mono:'Une couleur !', gold:'Or !', rotGain:'+1 rotation !', boom:'Boum !',
    layouts:['classique','étoilé','coins de pierre','île','piliers'],
    rotUnlockTip:'Débloquer la rotation (coûte 1 jeton)', rotFreeTip:'Tourner librement',
    rotate:'Tourner', rotateFree:'Tourner ∞',
    install:'Installer comme application', installTitle:'Installer Blokado', installNow:'Installer', close:'Fermer',
    installedNote:'Le jeu fonctionne déjà comme application installée.',
    instIntro:{ios:'Sur iPhone et iPad, on installe depuis Safari :', android:'Sur Android :', desktop:'Sur ordinateur :'},
    instNotSafari:'Ouvre cette page dans Safari - les autres navigateurs iOS ne permettent pas toujours d\'ajouter des applications.',
    instSteps:{
      ios:['Touche le bouton <b>Partager</b> <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M8 7l4-4 4 4"/><path d="M5 12v8h14v-8"/></svg> dans la barre de Safari.','Fais défiler et choisis <b>Sur l\'écran d\'accueil</b>.','Confirme avec <b>Ajouter</b>. L\'icône Blokado apparaîtra sur l\'écran d\'accueil.'],
      androidNative:['Touche <b>Installer</b> ci-dessous et confirme. L\'application apparaîtra sur l\'écran d\'accueil.'],
      android:['Ouvre le menu du navigateur <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg> en haut à droite.','Choisis <b>Ajouter à l\'écran d\'accueil</b> ou <b>Installer l\'application</b>.','Confirme. L\'icône Blokado apparaîtra sur l\'écran d\'accueil.'],
      desktopNative:['Clique sur <b>Installer</b> ci-dessous et confirme. Blokado s\'ouvrira dans sa propre fenêtre.'],
      desktop:['Chrome / Edge : clique sur l\'icône d\'installation à droite de la barre d\'adresse, ou menu <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg> → <b>Installer Blokado</b>.','Safari (macOS) : menu <b>Fichier → Ajouter au Dock</b>.','Firefox ne permet pas l\'installation - utilise Chrome ou Edge.']
    },
    hint:'&#8635; = tourner une pièce. 4 lignes d\'un coup = +1 rotation. Une ligne unicolore charge la barre - barre pleine = une bombe.',
    credits:'Jeu créé par' + CREDIT_LINK + 'avec l\'aide de ' + CC_LINK,
    shareText:(d,s)=>'BLOKADO - Défi du jour '+d+'\nMon score : '+s+' pts \u{1F9E9}',
    tut:[
      {title:'Pose des blocs, efface des lignes', text:'Fais glisser les pièces vers la grille. Remplis une ligne ou une colonne entière : elle disparaît et rapporte des points. La partie se termine quand plus aucune pièce ne rentre.'},
      {title:'Fais tourner tes pièces', text:'Tu as 3 jetons de rotation &#8635;. Appuyer sur le bouton sous une pièce dépense un jeton et débloque la rotation - tu peux ensuite la tourner autant que tu veux jusqu\'à la poser. Effacer 4 lignes d\'un coup rend un jeton !'},
      {title:'Joue avec les couleurs', text:'Une ligne d\'une seule couleur donne un bonus et charge la barre de couleur sous la grille. Quand la barre est pleine, une bombe apparaît dans l\'emplacement à côté - fais-la glisser sur la grille comme une pièce normale : elle nettoie une zone de 3x3. Planifier où va chaque couleur, ça paie.'},
      {title:'Cases spéciales', text:'&#9733; Étoile - des points quand tu la recouvres. Case dorée - bonus quand elle est effacée. Glace - à effacer deux fois. Pierre (mode défi) - ne disparaît jamais, construis autour.'}
    ]
  }
};
