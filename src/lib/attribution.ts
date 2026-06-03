export interface Attribution {
  current_page_url: string;
  current_page_path: string;
  current_page_title: string;
  current_referrer: string;
  current_utm_source: string;
  current_utm_medium: string;
  current_utm_campaign: string;
  current_utm_term: string;
  current_utm_content: string;
  first_page_url: string;
  first_page_path: string;
  first_referrer: string;
  first_utm_source: string;
  first_utm_medium: string;
  first_utm_campaign: string;
  first_utm_term: string;
  first_utm_content: string;
}

export function captureAttribution(): Attribution {
  const params = new URLSearchParams(window.location.search);

  const current = {
    current_page_url: window.location.href,
    current_page_path: window.location.pathname,
    current_page_title: document.title,
    current_referrer: document.referrer,
    current_utm_source: params.get('utm_source') ?? '',
    current_utm_medium: params.get('utm_medium') ?? '',
    current_utm_campaign: params.get('utm_campaign') ?? '',
    current_utm_term: params.get('utm_term') ?? '',
    current_utm_content: params.get('utm_content') ?? '',
  };

  if (!sessionStorage.getItem('first_page_url')) {
    sessionStorage.setItem('first_page_url', current.current_page_url);
    sessionStorage.setItem('first_page_path', current.current_page_path);
    sessionStorage.setItem('first_referrer', current.current_referrer);
    sessionStorage.setItem('first_utm_source', current.current_utm_source);
    sessionStorage.setItem('first_utm_medium', current.current_utm_medium);
    sessionStorage.setItem('first_utm_campaign', current.current_utm_campaign);
    sessionStorage.setItem('first_utm_term', current.current_utm_term);
    sessionStorage.setItem('first_utm_content', current.current_utm_content);
  }

  return {
    ...current,
    first_page_url: sessionStorage.getItem('first_page_url') ?? current.current_page_url,
    first_page_path: sessionStorage.getItem('first_page_path') ?? current.current_page_path,
    first_referrer: sessionStorage.getItem('first_referrer') ?? current.current_referrer,
    first_utm_source: sessionStorage.getItem('first_utm_source') ?? current.current_utm_source,
    first_utm_medium: sessionStorage.getItem('first_utm_medium') ?? current.current_utm_medium,
    first_utm_campaign: sessionStorage.getItem('first_utm_campaign') ?? current.current_utm_campaign,
    first_utm_term: sessionStorage.getItem('first_utm_term') ?? current.current_utm_term,
    first_utm_content: sessionStorage.getItem('first_utm_content') ?? current.current_utm_content,
  };
}
