// SRE Survival — Dynamic On-Call Incident Dispatch Engine
// Manages real-life incident alerts, sequential dispatching, and on-call progression

class IncidentEngine {
  constructor() {
    this.activeIncidentIndex = 0;
    this.currentIncident = null;
    this.resolvedIncidents = [];
    this.isResolving = false;

    // Ordered real-life incident scenarios mapped to stations and LABS
    this.incidents = [
      {
        id: 'inc-01',
        ticketId: 'INC-1042',
        severity: 'P2 - WARNING',
        title: 'Helpdesk Onboarding: Setup Path & Core Directory',
        room: 'Cafeteria & Breakroom',
        stationId: 'station_kiosk',
        labId: 'b01',
        lead: 'ALEX (On-Call Lead)',
        leadAvatar: '🧑‍💻',
        briefing: 'A junior engineer got locked out of the filesystem paths. We need you at the orientation kiosk to inspect paths (pwd, ls, cd) and verify their environment before they escalate to management.',
        impact: 'Low operational risk. Onboarding blocker.'
      },
      {
        id: 'inc-02',
        ticketId: 'INC-2084',
        severity: 'P1 - HIGH ALERT',
        title: 'Runaway PID Eating 100% CPU on Server Core A1',
        room: 'Cold Datacenter / Server Room',
        stationId: 'station_rack_proc',
        labId: 'i03',
        lead: 'MAYA (Systems Engineer)',
        leadAvatar: '👩‍🔧',
        briefing: 'CRITICAL CPU SPIKE! A rogue worker process has spawned runaway child threads and is pegging Server Core A1 at 100% utilization. Head into the Cold Datacenter immediately to locate the PID and terminate it safely.',
        impact: 'High latency on production web traffic.'
      },
      {
        id: 'inc-03',
        ticketId: 'INC-3190',
        severity: 'P1 - SECURITY',
        title: 'World-Writable Permissions Found on Web Configs',
        room: 'Open-Floor Dev Bay',
        stationId: 'station_dev_a',
        labId: 'b05',
        lead: 'ALEX (Security Lead)',
        leadAvatar: '🧑‍💻',
        briefing: 'Security compliance scan flagged 777 permissions on production configuration files! Anyone on the corporate network can alter deployment keys. Run over to Dev Desk Alpha and lock down chmod permissions now.',
        impact: 'Critical vulnerability. Security audit fail risk.'
      },
      {
        id: 'inc-04',
        ticketId: 'INC-4105',
        severity: 'P0 - OUTAGE',
        title: 'Nginx Web Proxy Crashed & Failed Auto-Restart',
        room: 'Cold Datacenter / Server Room',
        stationId: 'station_rack_sysd',
        labId: 'i06',
        lead: 'MAYA (Server Lead)',
        leadAvatar: '👩‍🔧',
        briefing: 'P0 OUTAGE! The frontend load balancer stopped serving traffic. Systemd reported a failed unit state. Navigate to Server Rack B2 in the Datacenter to inspect systemctl status, restart the daemon, and enable auto-recovery.',
        impact: 'Customers receiving 502 Bad Gateway errors.'
      },
      {
        id: 'inc-05',
        ticketId: 'INC-5221',
        severity: 'P1 - WARNING',
        title: 'Incident Wall Flood: Nginx /var/log Disk Full Warning',
        room: '24/7 NOC Monitoring Center',
        stationId: 'station_noc_logs',
        labId: 'i07',
        lead: 'SIREN (Incident Response Lead)',
        leadAvatar: '🚨',
        briefing: 'SIREN ALERT: Log partition /var/log is at 98% capacity! An application loop is dumping millions of uncompressed error logs. Reach the NOC Log Forensics desk to analyze the noise and rotate the files.',
        impact: 'Disk exhaustion will cause the main kernel to panic.'
      },
      {
        id: 'inc-06',
        ticketId: 'INC-6302',
        severity: 'P1 - HIGH IMPACT',
        title: 'AWS CLI Gateway & IAM Credentials Revoked',
        room: 'AWS Cloud Operations Hub',
        stationId: 'station_aws_iam',
        labId: 'aws-01',
        lead: 'NIMBUS (Cloud Lead)',
        leadAvatar: '☁️',
        briefing: 'Production CI deployment failed with 403 AccessDenied! The IAM policy was modified without peer review. Sprint to the AWS Cloud Wing console to reconfigure AWS credentials and restore cloud access.',
        impact: 'All automated cloud deployments currently halted.'
      },
      {
        id: 'inc-07',
        ticketId: 'INC-7410',
        severity: 'P0 - CRITICAL',
        title: 'Terraform Remote State Lock Contention',
        room: 'Terraform IaC Foundry',
        stationId: 'station_tf_core',
        labId: 'tf-01',
        lead: 'HASH (Infrastructure Architect)',
        leadAvatar: '🏗️',
        briefing: 'A broken deployment pipeline crashed while applying infrastructure changes and left an orphaned lock on the DynamoDB state table. Head to the Terraform Foundry to inspect state, run plan, and apply a clean workflow.',
        impact: 'Infrastructure changes completely blocked company-wide.'
      },
      {
        id: 'inc-08',
        ticketId: 'INC-8899',
        severity: 'P0 - DISASTER RECOVERY',
        title: 'Crisis Triage: Production Multi-Region Failover',
        room: 'Executive War Room & Incident Table',
        stationId: 'station_emergency',
        labId: 'i04',
        lead: 'INCIDENT-1 (AI Commander)',
        leadAvatar: '🤖',
        briefing: 'CRITICAL PRODUCTION OUTAGE! The primary region is dropping 80% of packets. All senior SREs are summoned to the Executive War Room table for emergency failover coordination.',
        impact: 'Global platform outage. Executive escalation.'
      }
    ];

    // Load saved progress if any
    this.initCurrentIncident();
  }

  initCurrentIncident() {
    // Find first unresolved incident
    const saved = localStorage.getItem('sre_incident_index');
    if (saved !== null) {
      this.activeIncidentIndex = parseInt(saved, 10) || 0;
    }
    if (this.activeIncidentIndex >= this.incidents.length) {
      this.activeIncidentIndex = this.incidents.length - 1;
    }
    this.currentIncident = this.incidents[this.activeIncidentIndex];
  }

  // Trigger alert for current incident
  broadcastIncidentAlert() {
    const inc = this.currentIncident;
    if (!inc) return;

    // Sound pager alert
    if (window.cyberAudio && typeof window.cyberAudio.pagerAlert === 'function') {
      window.cyberAudio.pagerAlert();
    }

    // Update UI alert banner
    if (window.gameUI && typeof window.gameUI.showIncidentAlertBanner === 'function') {
      window.gameUI.showIncidentAlertBanner(inc);
    }
  }

  // Check if a station is currently the distressed incident station
  isStationDistressed(stationId) {
    if (!this.currentIncident) return false;
    return this.currentIncident.stationId === stationId;
  }

  // Resolve current incident and queue next
  resolveCurrentIncident() {
    if (this.isResolving) return;
    this.isResolving = true;

    const inc = this.currentIncident;
    this.resolvedIncidents.push(inc.id);

    // Audio victory
    if (window.cyberAudio && typeof window.cyberAudio.taskComplete === 'function') {
      window.cyberAudio.taskComplete();
    }

    // Advance to next incident
    this.activeIncidentIndex++;
    localStorage.setItem('sre_incident_index', this.activeIncidentIndex);

    // Banner says resolved
    if (window.gameUI && typeof window.gameUI.showIncidentResolvedBanner === 'function') {
      window.gameUI.showIncidentResolvedBanner(inc);
    }

    // Dispatch next incident after 4 seconds
    setTimeout(() => {
      this.isResolving = false;
      if (this.activeIncidentIndex < this.incidents.length) {
        this.currentIncident = this.incidents[this.activeIncidentIndex];
        this.broadcastIncidentAlert();
      } else {
        // Cycled through all primary on-call shifts! Loop or free-mode
        this.activeIncidentIndex = 0;
        this.currentIncident = this.incidents[0];
        this.broadcastIncidentAlert();
      }
    }, 4500);
  }

  // Calculate angle & distance from player to active incident station
  getWaypointToIncident(playerX, playerY) {
    if (!this.currentIncident || !window.officeGame) return null;
    const st = window.officeGame.stations.find(s => s.id === this.currentIncident.stationId);
    if (!st) return null;

    const targetX = st.x + st.w / 2;
    const targetY = st.y + st.h / 2;
    const dx = targetX - playerX;
    const dy = targetY - playerY;
    const distance = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    return {
      distance: Math.round(distance / 12), // approximate meters
      angle: angle,
      room: this.currentIncident.room,
      stationName: st.name
    };
  }
}

window.incidentEngine = new IncidentEngine();
