import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import MaterialDatatable from "material-datatable";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)

  },
  delete: {
    backgroundColor: "red"
  }

}));

export default function Autor() {
  const classes = useStyles();

  const { register, handleSubmit, errors, getValues, setValue, reset } = useForm(
    { defaultValues: { nombre: "Nombre *", apellido: "Apellido *", edad: "Edad *", rut: "Rut *" } });

  const [contador, setContador] = useState(0)
  const [autores, setAutores] = useState([])
  const [accion, setAccion] = useState("Guardar")
  const [idAutor, setIdAutor] = useState(null);

  useEffect(() => {
    cargarAutor();
  }, []);

  const seleccionar = (item) => {
    setValue("nombre", item.nombre)
    setValue("apellido", item.apellido)
    setValue("edad", item.edad)
    setValue("rut", item.rut)
    setIdAutor(item._id)
    setAccion("Modificar")


  }
  const columns = [
    {
      name: "Seleccionar",
      options: {
        headerNoWrap: true,
        customBodyRender: (item, tablemeta, update) => {
          return (
            <Button
              variant="contained"
              className="btn-block"
              onClick={() => seleccionar(item)}
            >
              Seleccionar
            </Button>
          );
        },
      },
    },
    {
      name: 'Nombre',
      field: 'nombre'
    },
    {
      name: 'Apellido',
      field: 'apellido'
    }


  ];


  const options = {
    selectableRows: false,
    print: false,
    onlyOneRowCanBeSelected: false,
    textLabels: {
      body: {
        noMatch: "Lo sentimos, no se encuentran registros",
        toolTip: "Sort",
      },
      pagination: {
        next: "Siguiente",
        previous: "Página Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
    },
    download: false,
    pagination: true,
    rowsPerPage: 5,
    usePaperPlaceholder: true,
    rowsPerPageOptions: [5, 10, 25],
    sortColumnDirection: "desc",
  }
  const onSubmit = data => {

    if (accion == "Guardar") {
      axios
        .post("http://localhost:9000/api/autor", data, {
          headers: {
            Accept: '*/*'
          }
        })
        .then(
          (response) => {
            if (response.status == 200) {
              alert("Registro ok")
              cargarAutor();
              reset();
            }
          },
          (error) => {
            // Swal.fire(
            //   "Error",
            //   "No es posible realizar esta acción: " + error.message,
            //   "error"
            // );
          }
        )
        .catch((error) => {
          // Swal.fire(
          //   "Error",
          //   "No cuenta con los permisos suficientes para realizar esta acción",
          //   "error"
          // );
          console.log(error);
        });
    }
    if (accion == "Modificar") {
      axios
        .put("http://localhost:9000/api/autor/" + idAutor, data)
        .then(
          (response) => {
            if (response.status == 200) {
              alert("Modificado")
              cargarAutor();
              reset();
              setIdAutor(null)
              setAccion("Guardar")
              console.log(response.data)
            }
          },
          (error) => {
            // Swal.fire(
            //   "Error",
            //   "No es posible realizar esta acción: " + error.message,
            //   "error"
            // );
          }
        )
        .catch((error) => {
          // Swal.fire(
          //   "Error",
          //   "No cuenta con los permisos suficientes para realizar esta acción",
          //   "error"
          // );
          console.log(error);
        });
    }

  }

  const eliminar = () => {
    if (idAutor == null) {
      alert("Debe seleccionar un autor")
      return
    }
    axios
      .delete("http://localhost:9000/api/autor/" + idAutor)
      .then(
        (response) => {
          if (response.status == 200) {

            cargarAutor();
            reset();
            setIdAutor(null)
            setAccion("Guardar")
            console.log(response.data)
            alert("Eliminado")
          }
        },
        (error) => {
          // Swal.fire(
          //   "Error",
          //   "No es posible realizar esta acción: " + error.message,
          //   "error"
          // );
        }
      )
      .catch((error) => {
        // Swal.fire(
        //   "Error",
        //   "No cuenta con los permisos suficientes para realizar esta acción",
        //   "error"
        // );
        console.log(error);
      });
  }
  const cargarAutor = async () => {
    // const { data } = await axios.get('/api/zona/listar');

    const { data } = await axios.get("http://localhost:9000/api/autor");

    setAutores(data.autor);


  };
  function click2() {
    setContador(contador + 1);
  }
  return (
    <Container component="main" maxWidth="md">
      <CssBaseline />
      <div className={classes.paper}>
        <Button
          type="button"
          fullWidth
          variant="contained"

          className={classes.submit}
          onClick={() => { reset(); setAccion("Guardar"); setIdAutor(null) }}
        >
          Nuevo
          </Button>
        <Typography component="h1" variant="h5">
          Autor - Contador: {contador}
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="nombre"
                variant="outlined"
                required
                fullWidth
            
                label="Nombre"
                autoFocus
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="apellido"
                autoComplete="lname"
                inputRef={register}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                labelId="demo-customized-select-label"
                id="demo-customized-select"
      
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select>
              
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="rut"
                label="rut"
                id="rut"
                autoComplete="rut"
                inputRef={register}

              />
            </Grid>

          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            {accion}
          </Button>
          <Button
            type="button"
            fullWidth
            variant="contained"
            color="secondary"
            className={classes.delete}
            onClick={() => { eliminar() }}
          >
            Eliminar
          </Button>
          <Grid container spacing={1}>
            <MaterialDatatable

              title={"Autores"}
              data={autores}
              columns={columns}
              options={options}
            />
          </Grid>


        </form>


      </div>

    </Container>
  );
}