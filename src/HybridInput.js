import React, { useState } from 'react';

const fetchSuggestions = async (operand) => {
    const response = await fetch(`https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete`);
    if (!response.ok) {
        throw new Error('Failed to fetch suggestions');
    }
    const data = await response.json();
    
    const filteredData = data.filter((item) => item.name.toLowerCase().startsWith(operand.toLowerCase()));
    return filteredData;
};

const HybridInput = () => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [resultArr, setResultArr] = useState([]);
    const [inputArr, setinputArr] = useState([]);
    const [result, setResult] = useState('');
    const [error , setError] = useState('');
    const operands = ['+', '-', '*', '/'];

    const handleInputChange = async (event) => {
        const inputVal = event.target.value;
        setInputValue(inputVal)
        if (inputVal !== "") {
            if (!isNaN(event.target.value) && !isNaN(inputArr[inputArr.length -1])) {
                setError("Please enter an operand first.")
                return
            }
            if (inputArr.length > 0 && !isNaN(event.target.value) && isNaN(inputArr[inputArr.length -1]) && !operands.includes(inputArr[inputArr.length -1])) {
                setError("Please enter an operand first.")
                return
            }
            if (operands.includes(event.target.value) || !isNaN(event.target.value)) {
                setError("");
                const valueToAdd = isNaN(inputVal) ? event.target.value : parseFloat(inputVal); 
                setinputArr(prev => [...prev, event.target.value]);
                setResultArr(prev => [...prev, valueToAdd]);
                calculateResult([...resultArr, valueToAdd]);
                setInputValue('');
            }
            else {
                fetchSuggestions(inputVal).then(res => setSuggestions(res))
            }
        } 
        else {
            setSuggestions(null);
            
        }
    };

    const handleSelectSuggestion = (suggestion) => {
        if (inputArr.length > 0) {
            if (isNaN(inputArr[inputArr.length -1]) && !operands.includes(inputArr[inputArr.length -1])) {
                setError("Please enter an operand first.")
                setSuggestions(null);
                return
            }
            if (!isNaN(inputArr[inputArr.length -1]) && !operands.includes(inputArr[inputArr.length -1])) {
                setError("Please enter an operand first.")
                setSuggestions(null);
                return
            }
        }
        setinputArr(prev => [...prev,suggestion.name])
        setResultArr(prev => [...prev, suggestion.value])
        calculateResult([...resultArr, suggestion.value])

        setInputValue("")
        setError("")
        setSuggestions(null);
    };

    const HandleRemove = (index) => {
        setinputArr(prev => prev.slice(0, index).concat(prev.slice(index + 1)))
        setResultArr(prev => prev.slice(0, index).concat(prev.slice(index + 1)))
    } 

    const calculateResult = (array) => {
        let currentOperand = null;
        let currentOperator = null;
    
        array.forEach(item => {
            if (typeof item === 'number') {
                if (currentOperand === null) {
                currentOperand = item;
                } else {
                switch (currentOperator) {
                    case '+':
                    currentOperand += item;
                    break;
                    case '-':
                    currentOperand -= item;
                    break;
                    case '*':
                    currentOperand *= item;
                    break;
                    case '/':
                    currentOperand /= item;
                    break;
                    default:
                    break;
                }
                }
            } else if (typeof item === 'string') {
                if (['+', '-', '*', '/'].includes(item)) {
                currentOperator = item;
                }
            }
        });
    
        console.log(currentOperand)
        setResult(currentOperand);
    };

    return (
        <div className='container mx-auto my-36  w-[75%]'>
            <div className='flex flex-col justify-start gap-3'>
                <h2 className='text-2xl mb-2 font-bold'>Pro Tips:</h2>
                <p className='font-normal text-blue-950 text-xl'>1. Type "name" for suggestions.</p>
                <p className='font-normal text-blue-950 text-xl'>2. Click "x" icon to remove an item.</p>
                <p className='font-normal text-blue-950 text-xl'>3. Functional operands are '+', '-', '*', '/'</p>
                <p className='font-normal text-blue-950 text-xl'>4. Only applicable for single digit numbers.</p>
                <p className='font-normal text-blue-950 text-xl'>5. Removing any of the following operations '+', '-', '*', '/' from the middle of the calc string , would result in abrupt calculations.</p>
            </div>
            <div className='text-start my-5'>
                <p className='font-normal text-blue-950 text-4xl'>{result && <span> Result : {result} </span>}</p>
            </div>
            <div className="flex gap-2 justify-start align-middle my-3">
                {inputArr.map((item, index) => (
                    <p key={index} className='py-2 p-4 flex  items-start gap-2 rounded text-lg border border-[#caccce] bg-white text-[#6A788C] focus:outline-[#caccce]'>
                        {item}
                        <span className='text-red-500 cursor-pointer' onClick={() => HandleRemove(index)}>x</span>
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type here..."
                className='p-4 rounded text-lg border border-[#caccce] w-full bg-white text-[#6A788C] focus:outline-[#caccce]'
            />
            {error && <p className='text-xl text-red-500 font-bold'>{error}</p>}

            {suggestions && (
                <ul className={`${suggestions.length === 0 ? 'h-[full]':'h-[390px]'}  w-full mx-auto rounded-lg border border-[#caccce] mt-3 overflow-hidden overflow-y-auto bg-white`}>
                    {
                        suggestions.length === 0 ? 
                        <li className='border-bottom border-[#caccce] p-5 text-[#6A788C]'>
                            No suggestions found
                        </li>
                            :
                        suggestions.map((suggestion) => (
                        <li className='border-bottom border-[#caccce] p-5 hover:bg-[#ebebeb] text-[#6A788C]'  key={suggestion.id} onClick={() => handleSelectSuggestion(suggestion)}>
                            {suggestion.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default HybridInput;
