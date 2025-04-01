+++
title = "Privacy Policy"
type = "app"
+++
<p class="my-5 pb-5">
<span id="app-name">The app</span> does not collect, store, or share any personal data from its users.  
It does not engage in any activities that may compromise your privacy, and we do not affiliate ourselves with any third parties that do so.
</p>

<script>
    const urlParams = new URLSearchParams(window.location.search);
    const appName = urlParams.get('a')
    document.getElementById('app-name').textContent = appName == null ? "The app" : appName;
</script>
