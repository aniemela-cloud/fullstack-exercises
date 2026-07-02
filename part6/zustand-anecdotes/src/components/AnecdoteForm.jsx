import { useAnecdoteActions } from '../store'

const AnecdoteForm = () => {
    const { addNew } = useAnecdoteActions()

    const addAnecdote = (event) => {
        event.preventDefault()
        const aText = event.target.anecdote.value
        addNew(aText)
        event.target.reset()
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <div>
                    <input name="anecdote" />
                </div>
                <button>create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm