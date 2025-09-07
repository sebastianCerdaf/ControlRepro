const { productosBase } = window;

const { dialog } = require('electron').remote || require('@electron/remote');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

const app = Vue.createApp({
  data() {
    return {
      productos: JSON.parse(localStorage.getItem('productos')) || [],
      nuevoProducto: {
        id: '',
        nombre: '',
        categoria: '',
        precioCaja30: '',
        stock: '',
        stockMinimo: '',
        proveedores: []
      },
      productoBloqueado: false,
      rutaGuardado: '',
      sugerencias: [],
      mostrarSugerencias: false,
      mostrarErrorCampos: false
    };
  },
  methods: {
    agregarProducto() {
      if (
        this.nuevoProducto.stock === '' ||
        this.nuevoProducto.stockMinimo === ''
      ) {
        this.mostrarErrorTemporal('Debe ingresar el número de cajas y el punto de reposición.');
        this.productoBloqueado = false;
        return;
      }

      if (
        !this.nuevoProducto.id ||
        !this.nuevoProducto.categoria ||
        !this.nuevoProducto.precioCaja30
      ) {
        this.mostrarErrorTemporal('Por favor completa todos los campos del producto.');
        this.productoBloqueado = false;
        return;
      }

      const producto = { ...this.nuevoProducto };
      producto.proveedores = producto.proveedores || [];
      this.productos.push(producto);
      this.guardarLocal();
      this.borrarCamposProducto();
    },

    mostrarErrorTemporal(mensaje) {
      const popup = document.getElementById('popupError');
      popup.textContent = mensaje;
      popup.classList.add('visible');
      setTimeout(() => {
        popup.classList.remove('visible');
      }, 3000);
    },

    buscarSugerencias() {
      const texto = this.nuevoProducto.id.toLowerCase();
      this.sugerencias = productosBase.filter(p =>
        p.id.toLowerCase().includes(texto) ||
        p.nombre.toLowerCase().includes(texto)
      );
      this.mostrarSugerencias = true;
    },

    seleccionarProducto(producto) {
      this.nuevoProducto = {
        id: producto.id,
        nombre: producto.nombre,
        categoria: producto.categoria,
        precioCaja30: producto.precioCaja30,
        stock: '',
        stockMinimo: '',
        proveedores: producto.proveedores || []
      };
      this.productoBloqueado = false;
      this.mostrarSugerencias = false;
      this.sugerencias = [];
    },

    ocultarSugerencias() {
      setTimeout(() => {
        this.mostrarSugerencias = false;
      }, 200);
    },

    borrarCamposProducto() {
      this.nuevoProducto = {
        id: '',
        nombre: '',
        categoria: '',
        precioCaja30: '',
        stock: '',
        stockMinimo: '',
        proveedores: []
      };
      this.productoBloqueado = false;
    },

    eliminarProducto(index) {
      this.productos.splice(index, 1);
      this.guardarLocal();
    },

    seleccionarRuta() {
      const result = dialog.showOpenDialogSync({
        title: 'Selecciona una carpeta para guardar los archivos Excel',
        properties: ['openDirectory']
      });
      if (result && result.length > 0) {
        this.rutaGuardado = result[0];
        alert(`📁 Carpeta seleccionada:\n${this.rutaGuardado}`);
      }
    },

    guardarLocal() {
      localStorage.setItem('productos', JSON.stringify(this.productos));
    },

    mostrarModal() {
      document.getElementById('modalAcceso').classList.remove('hidden');
      document.getElementById('codigoInput').value = '';
      document.getElementById('mensajeError').textContent = '';
    },

    cerrarModal() {
      document.getElementById('modalAcceso').classList.add('hidden');
    },

    validarCodigo() {
      const codigo = document.getElementById('codigoInput').value;
      if (codigo === 'admin123') {
        window.location.href = 'ContactsView.html';
      } else {
        document.getElementById('mensajeError').textContent = 'Código incorrecto. Acceso denegado.';
      }
    },

    cerrarSesion() {
      localStorage.removeItem('productos');
      window.location.href = 'presentation/views/LoginView.html';
    },
    confirmarCerrarSesion() {
    document.getElementById('modalCerrarSesion').classList.remove('hidden');
    },

   cerrarModalCerrarSesion() {
    document.getElementById('modalCerrarSesion').classList.add('hidden');
}
  }
});

app.mount('#app');
