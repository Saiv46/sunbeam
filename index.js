const Protocol = require("protodef-neo")
const protocolData = require("./protocol.json")
const beam = new Protocol(protocolData).get("beam")

/**
 * DEFAULT_UNIT - time units (1000 = 1 sec)
 * DEFAULT_EPOCH - custom epoch (01/01/2000 00:00:00:000)
 */
const DEFAULT_UNIT = 1000
const DEFAULT_EPOCH = 946684800000

module.exports = class Sunbeam {
	constructor (value = 0, unit = DEFAULT_UNIT, epoch = DEFAULT_EPOCH) {
		this.unit = unit | 0
		this.epoch = +epoch
		this.value = value
	}

	get value () { return this.data }
	set value (val) {
		if (val instanceof Sunbeam) {
			this.unit = val.unit
			this.epoch = val.epoch
			this.data = val.data
			return
		}
		const buf = Buffer.alloc(8)
		switch (typeof val) {
			case "number":
				buf.writeUInt32BE(val % 2**32)
				buf.writeUInt32BE(val / 2**32 | 0, 4)
				break
			case "bigint":
				buf.writeBigInt64BE(val)
				break
			case "string":
			case "object":
				Buffer.from(val, "base64").copy(buf)
				break
			default:
				throw new Error("Unsupported type")	
		}
		this.data = beam.fromBuffer(buf)
	}
	
	clone () { return new Sunbeam(this) }
	toBuffer () { return beam.toBuffer(this.data) }
	toString () { return this.toBuffer().toString("base64") }
	toBigInt () { return this.toBuffer().readBigInt64BE() }
	toNumber () {
		const buf = this.toBuffer()
		return buf.readUInt32BE() * 2**32 + buf.readUInt32BE(4)
	}
	
	get timestamp () { return this.data.timestamp }
	get machineId () { return this.data.machineId }
	get sequenceId () { return this.data.sequenceId }
	get flipFlag () { return this.data.flipFlag }
	
	set timestamp (v) { this.data.timestamp = +v }
	set machineId (v) { this.data.machineId = v | 0 }
	set sequenceId (v) { this.data.sequenceId = v | 0 }
	set flipFlag (v) { this.data.flipFlag = v & 1 }
	
	static generate (machineId, sequenceId, flipFlag, unit, epoch) {
		const beam = new Sunbeam(void 0, unit, epoch)
		beam.machineId = machineId
		beam.sequenceId = sequenceId
		beam.flipFlag = flipFlag
		beam.timestamp = Date.now()
		return beam
	}

	static *createGenerator (machineId, unit, epoch) {
		const beam = new Sunbeam(void 0, unit, epoch)
		beam.machineId = machineId
		let sequenceId = 0
		let flipFlag = 0
		let prevTime = beam.unit
		let currTime = 0
		while (true) {
			if (prevTime > (currTime = Date.now() % unit)) {
				prevTime = currTime
				sequenceId = 0
			}
			beam.timestamp = Date.now()
			beam.sequenceId = (sequenceId = sequenceId++ % (1 << 8))
			beam.flipFlag = (flipFlag ^= 1)
			yield beam.clone()
		}
	}
}
