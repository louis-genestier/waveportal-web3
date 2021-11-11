const Form = ({ handleSubmit, inputValue, setInputValue, isMining }) => {
    return (
        <form className="mt-5 flex" onSubmit={ handleSubmit }>
            <input
              type="text"
              className={ "rounded-l pl-1 bg-gray-200 appearance-none border-t-2 border-l-2 border-b-2 border-gray-200 text-gray-700 focus:outline-none focus:bg-white focus:border-purple-600" + (isMining ? 'disabled:opacity-50 cursor-not-allowed' : '') }
              placeholder="Your message"
              value={ inputValue }
              onChange={ e => setInputValue(e.target.value) }
              disabled={ isMining }
            />
            <button type="submit" className={"bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-r inline-flex items-center " + (isMining ? 'disabled:opacity-50 cursor-not-allowed' : '') } disabled={ isMining }>
              { !isMining ? <>Wave at me</> : (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Mining...
                </>
              ) }
            </button>
        </form>
    )
}

export default Form;