class TrustProxies {
  constructor() {
    // The trusted proxies for this application
    this.proxies = null;

    // The headers that should be used to detect proxies
    this.headers = [
      'X-Forwarded-For',
      'X-Forwarded-Host', 
      'X-Forwarded-Port',
      'X-Forwarded-Proto',
      'X-Forwarded-AWS-ELB'
    ];
  }
}

export default TrustProxies;