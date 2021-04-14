class Connection {
  constructor(from, to) {
    this.from = from
    this.to = to
    //Peso de la Conexion
    this.weight = Math.random()*(1.5 - 0.5)+0.5;
    //Cambio a realizar a ese peso en esa conexion de esa neurona en esa capa
    this.change = 0
  }

  toJSON() {
    return {
      change: this.change,
      weight: this.weight,
      from: this.from.id,
      to: this.to.id
    }
  }

  setWeight(w) {
    this.weight = w
  }

  setChange(val) {
    this.change = val
  }
}

module.exports = Connection;