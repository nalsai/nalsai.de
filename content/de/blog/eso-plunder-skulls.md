+++
title = "ESO Dremora-Plünderschädel Checkliste"
tags = [
    "The Elder Scrolls Online",
    "Gaming"
]
date = 2022-10-13
+++

Diese Checkliste speichert die Auswahl, damit man nachverfolgen kann, welche Dremora-Plünderschädel man bereits während des Hexenfest-Events in ESO gesammelt hat.

<ul class="list-group my-4">
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="delve">
        <label class="form-check-label" for="delve">Gewölbe Bosse<span class="text-muted"> - Stäbe and Gürtel</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="insurgent">
        <label class="form-check-label" for="insurgent">Vorstöße Bosse (Dolmen etc.)<span class="text-muted"> - Dolche und Handschuhe</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="world">
        <label class="form-check-label" for="world">Weltbosse<span class="text-muted"> - Schultern und Äxte</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="dungeon">
        <label class="form-check-label" for="dungeon">Verlies Endbosse<span class="text-muted"> - Helme und Streitkolben</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="public">
        <label class="form-check-label" for="public">Offene Dungeon Bosse<span class="text-muted"> - Schilde und Stiefel</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="arena">
        <label class="form-check-label" for="arena">Arena Endbosse<span class="text-muted"> - Bögen und Beine</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="trial">
        <label class="form-check-label" for="trial">Prüfung Endbosse<span class="text-muted"> - Schwerter und Bruststücke</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="trial">
        <label class="form-check-label" for="trial">Krähengeborenes Grauen<span class="text-muted"></span></label>
    </li>
</ul>

Man kann jede Art von Dremora-Plünderschädel einmal am Tag erhalten. Der Reset erfolgt täglich um 06:00 Uhr UTC+0.

Klicken Sie auf <button type="button" class="btn btn-outline-danger" OnClick="uncheck_all()">alle deaktivieren</button>, um alle Kontrollkästchen zu deaktivieren..

<hr class="my-5">

Weitere Informationen zum Hexenfest finden Sie unter <https://eso-hub.com/de/events/hexenfest>.

<script>
// Source: http://www.marcorpsa.com/ee/t2641.html
(function () {
    var cbstate;

    window.addEventListener('load', function () {
        cbstate = JSON.parse(localStorage['CBState'] || '{}');

        for (var i in cbstate) {
            var el = document.querySelector('input[id="' + i + '"]');
            if (el) el.checked = true;
        }

        var cb = document.getElementsByClassName('save-cb-state');

        for (var i = 0; i < cb.length; i++) {

            cb[i].addEventListener('click', function (evt) {
                // get the cbstate again, in case uncheck_all was invoked
                cbstate = JSON.parse(localStorage['CBState'] || '{}');

                if (this.checked) {
                    cbstate[this.id] = true;
                }
                else if (cbstate[this.id]) {
                    delete cbstate[this.id];
                }

                localStorage.CBState = JSON.stringify(cbstate);
            });
        }
    });
})();

function uncheck_all() {
    document.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = false)
    localStorage.CBState = "{}";
}
</script>
