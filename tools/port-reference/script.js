(function () {
  "use strict";
  const searchInput = document.getElementById("portSearch");
  const filtersContainer = document.getElementById("portFilters");
  const tableBody = document.getElementById("portTableBody");

  const PORTS = [
    { port: 20, service: "FTP Data", proto: "TCP", desc: "File Transfer Protocol data channel", cat: "other" },
    { port: 21, service: "FTP Control", proto: "TCP", desc: "File Transfer Protocol control channel", cat: "other" },
    { port: 22, service: "SSH", proto: "TCP", desc: "Secure Shell remote login", cat: "remote" },
    { port: 23, service: "Telnet", proto: "TCP", desc: "Unencrypted remote login", cat: "remote" },
    { port: 25, service: "SMTP", proto: "TCP", desc: "Simple Mail Transfer Protocol (sending)", cat: "mail" },
    { port: 53, service: "DNS", proto: "TCP/UDP", desc: "Domain Name System", cat: "other" },
    { port: 67, service: "DHCP Server", proto: "UDP", desc: "Dynamic Host Configuration Protocol server", cat: "other" },
    { port: 68, service: "DHCP Client", proto: "UDP", desc: "Dynamic Host Configuration Protocol client", cat: "other" },
    { port: 80, service: "HTTP", proto: "TCP", desc: "Hypertext Transfer Protocol (web)", cat: "web" },
    { port: 110, service: "POP3", proto: "TCP", desc: "Post Office Protocol v3 (receiving mail)", cat: "mail" },
    { port: 143, service: "IMAP", proto: "TCP", desc: "Internet Message Access Protocol", cat: "mail" },
    { port: 443, service: "HTTPS", proto: "TCP", desc: "HTTP Secure (encrypted web)", cat: "web" },
    { port: 445, service: "SMB", proto: "TCP", desc: "Server Message Block (Windows file sharing)", cat: "other" },
    { port: 993, service: "IMAPS", proto: "TCP", desc: "IMAP over SSL/TLS", cat: "mail" },
    { port: 995, service: "POP3S", proto: "TCP", desc: "POP3 over SSL/TLS", cat: "mail" },
    { port: 1433, service: "MS SQL", proto: "TCP", desc: "Microsoft SQL Server", cat: "database" },
    { port: 1521, service: "Oracle DB", proto: "TCP", desc: "Oracle database", cat: "database" },
    { port: 3306, service: "MySQL", proto: "TCP", desc: "MySQL/MariaDB database", cat: "database" },
    { port: 3389, service: "RDP", proto: "TCP", desc: "Remote Desktop Protocol (Windows)", cat: "remote" },
    { port: 5432, service: "PostgreSQL", proto: "TCP", desc: "PostgreSQL database", cat: "database" },
    { port: 5672, service: "AMQP", proto: "TCP", desc: "RabbitMQ message broker", cat: "other" },
    { port: 5900, service: "VNC", proto: "TCP", desc: "Virtual Network Computing", cat: "remote" },
    { port: 6379, service: "Redis", proto: "TCP", desc: "Redis in-memory data store", cat: "database" },
    { port: 8080, service: "HTTP Alt", proto: "TCP", desc: "Alternative HTTP port (proxies, dev servers)", cat: "web" },
    { port: 8443, service: "HTTPS Alt", proto: "TCP", desc: "Alternative HTTPS port", cat: "web" },
    { port: 8888, service: "Jupyter", proto: "TCP", desc: "Jupyter Notebook server", cat: "web" },
    { port: 9090, service: "Prometheus", proto: "TCP", desc: "Prometheus monitoring", cat: "other" },
    { port: 9200, service: "Elasticsearch", proto: "TCP", desc: "Elasticsearch search engine", cat: "database" },
    { port: 9418, service: "Git", proto: "TCP", desc: "Git protocol (unauthenticated)", cat: "other" },
    { port: 11211, service: "Memcached", proto: "TCP/UDP", desc: "Memcached distributed caching", cat: "database" },
    { port: 27017, service: "MongoDB", proto: "TCP", desc: "MongoDB document database", cat: "database" },
    { port: 50000, service: "SAP", proto: "TCP", desc: "SAP system", cat: "other" }
  ];

  let activeFilter = "all";

  function render() {
    const q = searchInput.value.toLowerCase();
    const filtered = PORTS.filter(p => {
      const matchSearch = !q || p.port.toString().includes(q) || p.service.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
      const matchCat = activeFilter === "all" || p.cat === activeFilter;
      return matchSearch && matchCat;
    });

    tableBody.innerHTML = filtered.map(p =>
      '<tr><td class="mono">' + p.port + '</td><td><strong>' + p.service + '</strong></td><td>' + p.proto + '</td><td>' + p.desc + '</td></tr>'
    ).join("");

    if (filtered.length === 0) {
      tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-dim);padding:20px;">No matching ports found.</td></tr>';
    }
  }

  filtersContainer.addEventListener("click", function (e) {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filtersContainer.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    render();
  });

  searchInput.addEventListener("input", render);
  render();
})();
