import { Table, Container, Button } from 'react-bootstrap'
import ContentsApi from './api/ContentsApi'
import { useEffect, useState } from 'react'
import CreateContentModal from './components/CreateContentModal'
import UpdateContentModal from './components/UpdateContentModal'

function App() {
  const [contents, setContents] = useState()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [selectedContent, setSelectedContent] = useState()

  const handleCloseCreateModal = () => setIsCreateModalOpen(false);
  const handleShowCreateModal = () => setIsCreateModalOpen(true);

  const handleCloseUpdateModal = () => setIsUpdateModalOpen(false);
  const handleShowUpdateModal = () => setIsUpdateModalOpen(true);

  useEffect(() => {
    async function getData() {
      await ContentsApi().getContents().then(data => {
        return data.json()
      })
      .then(data => {
        setContents(data)
      })
    }

    getData()
  }, [])

  async function deleteContent(contentId) {
    try {
      await ContentsApi().deleteContent(contentId)

      const formattedContents = contents.filter(cont => {
        if(cont.id !== contentId){
          return cont
        }
      })

      setContents(formattedContents)
    } catch(err) {
      throw err
    }
  }

  async function createContent(event) {
    try {
      event.preventDefault()

      const req = event.currentTarget.elements

      await ContentsApi().createContent(
        req.titulo.value, req.descricao.value, Number(req.porcentagem.value)
      ).then(data => {
        return data.json()
      }).then(res => {
        setContents([...contents, {
          id: res.contentId,
          titulo: req.titulo.value,
          descricao: req.descricao.value,
          porcentagem: Number(req.porcentagem.value)
        }])

        setIsCreateModalOpen(false)
      })
    } catch(err) {
      throw err
    }
  }

  async function updateContent(event) {
    try {
      event.preventDefault()

      const req = event.currentTarget.elements

      await ContentsApi().updateContent(
        selectedContent.id, req.titulo.value, req.descricao.value, Number(req.porcentagem.value)
      )

      const formattedContents = contents.map(cont => {
        if(cont.id === selectedContent.id) {
          return {
            id: selectedContent.id,
            titulo:  req.titulo.value,
            descricao: req.descricao.value,
            porcentagem: Number(req.porcentagem.value)
          }
        }

        return cont
      })

      setContents(formattedContents)

      setIsUpdateModalOpen(false)
    } catch(err) {
      throw err
    }
  }

  return (
    <>
      <header>
        <h1>
          <img src="/src/img/logo-tipo.png" width="100" height="100"></img>
          Library
        </h1>
        <p>
          Essa extensão do Library permite gravar todos os livros que está lendo
          atualmente na nossa plataforma. <br />
          Library é uma nova forma de você quardar historias que marcam seu
          coração.
        </p>
      </header>
      <Container
        className="
        d-flex
        flex-column
        align-items-start
        justify-content-center
        "
      >
        <Button
          className="mb-2"
          onClick={handleShowCreateModal}
          variant="primary"
        >
        Novo Livro
        </Button>
        <Table striped bordered hover>
          <thead>
            <tr className='cor1'>
              <th>Titulo</th>
              <th>Descrição</th>
              <th>Marcador de Página</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody className='cor'>
            {contents &&
              contents.map((cont) => (
                <tr key={cont.id}>
                  <td className='cor'>{cont.titulo}</td>
                  <td className='cor'>{cont.descricao}</td>
                  <td className='cor'>{cont.porcentagem}</td>
                  <td>
                    <Button
                      onClick={() => deleteContent(cont.id)}
                      variant="danger"
                    >
                      Excluir
                    </Button>
                    <Button
                      onClick={() => {
                        handleShowUpdateModal();
                        setSelectedContent(cont);
                      }}
                      variant="warning"
                      className="m-1"
                    >
                      Atualizar
                    </Button>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </Container>
      <CreateContentModal
        isModalOpen={isCreateModalOpen}
        handleClose={handleCloseCreateModal}
        createContent={createContent}
      />
      {selectedContent && (
        <UpdateContentModal
          isModalOpen={isUpdateModalOpen}
          handleClose={handleCloseUpdateModal}
          updateContent={updateContent}
          content={selectedContent}
        />
      )}
    </>
  );
}

export default App
