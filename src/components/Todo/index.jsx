import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Formik, Field, Form } from 'formik';

import { getTodo } from '../../redux/todo/todo.selector';
import { addTodo, resetTodo } from '../../redux/todo/todo.action';

import style from './Todo.module.scss';

const Todo = props => {
    const state = useSelector(state => state);
    const dispatch = useDispatch();
    const formRef = useRef(null);

    const todos = getTodo(state);
    const onSubmitHandler = (values, action) => {
        dispatch(addTodo(todos.length + 1, values.title));
    };

    const resetHandler = () => {
        dispatch(resetTodo());
    };

    useEffect(() => {
        formRef?.current?.resetForm();
    }, [todos]);

    return (
        <div className={style.container}>
            <div className={style.formContainer}>
                <Formik
                    innerRef={formRef}
                    initialValues={{
                        title: '',
                    }}
                    onSubmit={onSubmitHandler}
                >
                    <Form>
                        <div className={style.formItem}>
                            <label htmlFor='title'>Task</label>
                            <Field id='title' name='title' placeholder='New Todo' />
                        </div>
                        <button type='submit'>Submit</button>
                    </Form>
                </Formik>
            </div>
            <div className={style.operations}>
                <button onClick={resetHandler}>Reset</button>
            </div>
            <div className='todoList'>
                <h2>To do: {todos.length}</h2>
                <ul>
                    {todos.map(item => (
                        <li key={item.id}>{item.text}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

Todo.propTypes = {};
Todo.defaultProps = {};

export default Todo;
