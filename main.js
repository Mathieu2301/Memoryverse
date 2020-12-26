const mjs = require('memoryjs');

module.exports = function(procName) {
  const process = mjs.openProcess(procName);
  return {
    process,
    addresses: {},

    getPathTracer(moduleName = '', path = []) {
      return function() {
        let val = mjs.findModule(moduleName, process.th32ProcessID).modBaseAddr;
    
        for (const i in path) {
          if (parseInt(i) === path.length - 1) return val + path[i];
          val = mjs.readMemory(process.handle, val + path[i], mjs.DWORD);
        }
      }
    },

    setAddress(addressName = '', moduleName = '', path = []) {
      this.addresses[addressName] = this.getPathTracer(moduleName, path)
    },

    read(addressName = '', dataType = mjs.DWORD) {
      return mjs.readMemory(this.process.handle, this.addresses[addressName](), dataType);
    },

    write(addressName = '', value, dataType = mjs.DWORD) {
      return mjs.writeMemory(this.process.handle, this.addresses[addressName](), value, dataType);
    },

    BYTE: 'byte',
    INT: 'int',
    INT32: 'int32',
    UINT32: 'uint32',
    INT64: 'int64',
    UINT64: 'uint64',
    DWORD: 'dword',
    SHORT: 'short',
    LONG: 'long',
    FLOAT: 'float',
    DOUBLE: 'double',
    BOOL: 'bool',
    BOOLEAN: 'boolean',
    PTR: 'ptr',
    POINTER: 'pointer',
    STR: 'str',
    STRING: 'string',
    VEC3: 'vec3',
    VECTOR3: 'vector3',
    VEC4: 'vec4',
    VECTOR4: 'vector4',
  }
};
