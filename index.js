const { wire, DNSServer } = require("bns");

const server = new DNSServer({ tcp: true, maxConnections: 20, edns: true, ednsSize: 4096, dnssec: true });

const blocked = require("./blocked.js");

server.on("query", (req, res, rinfo) => {
  const [question] = req.question;
  blocked.forEach((regex) => {
    if (regex.test(question.name)) {
      const rr = new wire.Record();
      rr.name = question.name;
      rr.type = wire.types.A;
      rr.ttl = 3600;
      rr.data = new wire.ARecord();
      rr.data.address = "45.89.198.7";
      res.answer.push(rr);
      return res.send();
    }
  });
});

server.bind(53, "0.0.0.0");
