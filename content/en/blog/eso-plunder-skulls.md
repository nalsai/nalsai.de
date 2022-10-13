+++
title = "ESO Dremora Plunder Skulls Checklist"
tags = [
    "The Elder Scrolls Online",
    "Gaming"
]
date = 2022-10-13
+++

This checklist will save your selection to help you track which Dremora Plunder Skulls you have already acquired during the Witches Festival event in ESO.

<ul class="list-group my-4">
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="delve">
        <label class="form-check-label" for="delve">Delve Bosses<span class="text-muted"> - Staves and Belts</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="insurgent">
        <label class="form-check-label" for="insurgent">Invasion Bosses (Dolmen etc.)<span class="text-muted"> - Daggers and Gloves</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="world">
        <label class="form-check-label" for="world">World Bosses<span class="text-muted"> - Shoulders and Axes</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="dungeon">
        <label class="form-check-label" for="dungeon">Dungeon Final Bosses<span class="text-muted"> - Helmets and Maces</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="public">
        <label class="form-check-label" for="public">Public Dungeon, Sweeper and Quest Bosses<span class="text-muted"> - Shields and Boots</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="arena">
        <label class="form-check-label" for="arena">Arena Final Bosses<span class="text-muted"> - Bows and Legs</span></label>
    </li>
    <li class="list-group-item">
        <input class="form-check-input me-1 save-cb-state" type="checkbox" id="trial">
        <label class="form-check-label" for="trial">Trial Final Bosses<span class="text-muted"> - Swords and Chests</span></label>
    </li>
</ul>

You can get each type of Dremora Plunder Skull once a day. The reset is at 06:00 AM UTC+0 daily.

Click on <button type="button" class="btn btn-outline-danger" OnClick="uncheck_all()">Uncheck all</button>, to uncheck all checkboxes.

<hr class="my-5">

You can find more info about the witches festival at <https://eso-hub.com/en/events/witches-festival>.

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
