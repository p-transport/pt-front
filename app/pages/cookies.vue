<template>
  <div class="page-bg min-h-screen px-4 pb-16 pt-24">
    <div class="max-w-3xl mx-auto">
      <div class="bg-white p-8 lg:p-12 rounded-[2rem] shadow-sm">

        <h1 class="text-3xl font-bold mb-2">Cookie &amp; Privacy Policy</h1>
        <p class="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

        <!-- 1. What are cookies -->
        <section class="mb-10">
          <h2 class="section-heading">What are cookies?</h2>
          <p class="body-text">
            Cookies are small text files placed on your device when you visit a website.
            We also use <em>localStorage</em> — a similar browser storage mechanism — to remember
            your preferences. This policy covers both.
          </p>
        </section>

        <!-- 2. Cookies we use -->
        <section class="mb-10">
          <h2 class="section-heading">Cookies we use</h2>
          <p class="body-text mb-4">
            We keep our use of cookies to a minimum. Below is the full list.
          </p>
          <div class="overflow-x-auto">
            <table class="cookie-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Purpose</th>
                  <th>Retention</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>cookie_consent</code></td>
                  <td><span class="badge badge-essential">Essential</span></td>
                  <td>Stores your cookie preference (accepted / rejected) so we don't ask again.</td>
                  <td>Until you clear it or change your choice</td>
                </tr>
                <tr>
                  <td><code>_ga</code></td>
                  <td><span class="badge badge-analytics">Analytics</span></td>
                  <td>Google Analytics 4 — distinguishes unique users. Only set if you accept analytics cookies.</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td><code>_ga_*</code></td>
                  <td><span class="badge badge-analytics">Analytics</span></td>
                  <td>Google Analytics 4 — maintains session state. Only set if you accept analytics cookies.</td>
                  <td>2 years</td>
                </tr>
                <tr>
                  <td><code>_gid</code></td>
                  <td><span class="badge badge-analytics">Analytics</span></td>
                  <td>Google Analytics — distinguishes users within a session. Only set if you accept analytics cookies.</td>
                  <td>24 hours</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="body-text mt-4 text-sm text-gray-500">
            Analytics cookies are only placed after you explicitly accept them. If you reject
            non-essential cookies, only the <code>cookie_consent</code> preference is stored.
          </p>
        </section>

        <!-- 3. Data controller -->
        <section class="mb-10">
          <h2 class="section-heading">Data controller</h2>
          <p class="body-text">
            The data controller for PublicTransport.is is:
          </p>
          <address class="body-text not-italic mt-2 pl-4 border-l-2 border-gray-200">
            <strong>Hjólafærni á Íslandi</strong><br>
            <a href="https://www.hjolafaerni.is" target="_blank" class="text-link">www.hjolafaerni.is</a><br>
            Email: <a href="mailto:info@hjolafaerni.is" class="text-link">info@hjolafaerni.is</a>
          </address>
          <p class="body-text mt-4">
            Google Analytics data is processed by Google Ireland Limited under
            the EU–US Data Privacy Framework. For more information see
            <a href="https://policies.google.com/privacy" target="_blank" class="text-link">Google's privacy policy</a>.
          </p>
        </section>

        <!-- 4. GDPR rights -->
        <section class="mb-10">
          <h2 class="section-heading">Your rights under GDPR</h2>
          <p class="body-text mb-3">
            If you are located in the European Economic Area, you have the following rights
            regarding your personal data:
          </p>
          <ul class="rights-list">
            <li><strong>Access</strong> — request a copy of the data we hold about you.</li>
            <li><strong>Rectification</strong> — request correction of inaccurate data.</li>
            <li><strong>Erasure</strong> — request deletion of your data ("right to be forgotten").</li>
            <li><strong>Restriction</strong> — request that we limit how we process your data.</li>
            <li><strong>Portability</strong> — receive your data in a structured, machine-readable format.</li>
            <li><strong>Objection</strong> — object to processing based on legitimate interest.</li>
            <li><strong>Withdraw consent</strong> — withdraw analytics consent at any time (see below). This does not affect the lawfulness of processing before withdrawal.</li>
          </ul>
          <p class="body-text mt-4">
            To exercise any of these rights, contact us at
            <a href="mailto:info@hjolafaerni.is" class="text-link">info@hjolafaerni.is</a>.
            You also have the right to lodge a complaint with the
            <a href="https://www.personuvernd.is" target="_blank" class="text-link">Icelandic Data Protection Authority (Persónuvernd)</a>.
          </p>
        </section>

        <!-- 5. Change your choice -->
        <section class="mb-10">
          <h2 class="section-heading">Change your cookie preference</h2>
          <p class="body-text mb-4">
            You can withdraw or change your consent at any time by clicking the button below.
            Your choice will be reset and the consent banner will reappear on your next page load.
          </p>
          <button class="btn-reset" @click="resetConsent">
            Reset cookie preference
          </button>
          <p v-if="resetDone" class="mt-3 text-sm text-green-600 font-medium">
            Preference cleared. Reload the page to see the consent banner again.
          </p>
        </section>

        <!-- 6. Contact -->
        <section>
          <h2 class="section-heading">Contact</h2>
          <p class="body-text">
            For any questions about this policy or your data, email us at
            <a href="mailto:info@hjolafaerni.is" class="text-link">info@hjolafaerni.is</a>.
          </p>
        </section>

      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'CookiesPage',
  setup() {
    const resetDone = ref(false)

    function resetConsent() {
      localStorage.removeItem('cookie_consent')
      resetDone.value = true
    }

    return { resetDone, resetConsent }
  }
}
</script>

<style scoped>
.section-heading {
  font-size: 1.2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.body-text {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.7;
}

.text-link {
  color: #0066cc;
  text-decoration: underline;
}

.text-link:hover {
  color: #0052a3;
}

/* Cookie table */
.cookie-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
  color: #374151;
}

.cookie-table th {
  text-align: left;
  padding: 10px 12px;
  background: #f9fafb;
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #111827;
  white-space: nowrap;
}

.cookie-table td {
  padding: 10px 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.cookie-table tr:last-child td {
  border-bottom: none;
}

.badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge-essential {
  background: #dcfce7;
  color: #15803d;
}

.badge-analytics {
  background: #dbeafe;
  color: #1d4ed8;
}

code {
  font-family: ui-monospace, 'Cascadia Code', monospace;
  font-size: 0.8em;
  background: #f3f4f6;
  padding: 1px 5px;
  border-radius: 4px;
  color: #1f2937;
}

/* Rights list */
.rights-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rights-list li {
  font-size: 0.95rem;
  color: #374151;
  line-height: 1.6;
  padding-left: 1.2rem;
  position: relative;
}

.rights-list li::before {
  content: '–';
  position: absolute;
  left: 0;
  color: #9ca3af;
}

/* Reset button */
.btn-reset {
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid #0066cc;
  background: transparent;
  color: #0066cc;
  transition: background 0.2s ease, color 0.2s ease;
}

.btn-reset:hover {
  background: #0066cc;
  color: #fff;
}
</style>
