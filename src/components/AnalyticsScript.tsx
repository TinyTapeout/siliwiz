export function AnalyticsScript() {
  return (
    <>
      <script async src="https://www.googletagmanager.com/gtag/js?id=G-47PGJFSMHD" />
      <script>{`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    'ad_storage': 'denied'
  });

  gtag('js', new Date());

  gtag('config', 'G-47PGJFSMHD');
  `}</script>
    </>
  );
}
