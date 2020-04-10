# Sunbeam

An NodeJS distributed customizable ID generator inspired by [Twitter's Snowflake](https://developer.twitter.com/en/docs/basics/twitter-ids)

# API

This module exports only one class - `Sunbeam`

### constructor ( ?value : Number|String|Buffer|Sunbeam, ?unit : Number, ?epoch : Number )
- `value` may be any supported format or undefined
- `unit` by default is 1000ms
- `epoch` by default is 01/01/2000 00:00:00:000

### toBuffer ( )
### toString ( )
### toBigInt ( )
### toNumber ( )
Methods to export Sunbeam

### clone ( )
Self-explainatory method

### [get/set] timestamp : Number <32bit>
### [get/set] machineId : Number <12bit>
### [get/set] sequenceId : Number <8bit>
### [get/set] flipFlag : Number <1bit>
See Snowflake/Sonyflake/etc docs

### static generate ( machineId, sequenceId, flipFlag, unit, epoch)
Create new Sunbeam with pre-filled params

### static *createGenerator (machineId, unit, epoch)
Create Sunbeam IDs generator
