import React, { useReducer, useContext, useEffect } from "react";
import axios from "axios";
import { reducer } from "./reducer";

import {
  DISPLAY_ALERT,
  HIDE_ALERT,
  SETUP_USER_BEGIN,
  SETUP_USER_SUCCESS,
  SETUP_USER_ERROR,
  TOGGLE_SIDEBAR,
  LOGOUT_USER,
  UPDATE_USER_BEGIN,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_ERROR,
  HANDLE_CHANGE,
  CLEAR_VALUE,
  CREATE_JOB_BEGIN,
  CREATE_JOB_SUCCESS,
  CREATE_JOB_ERROR,
  GET_JOBS_BEGIN,
  GET_JOBS_SUCCESS,
  SET_EDIT_JOB,
  DELETE_JOB_BEGIN,
  EDIT_JOB_BEGIN,
  EDIT_JOB_SUCCESS,
  EDIT_JOB_ERROR,
  SHOW_STATS_BEGIN,
  SHOW_STATS_SUCCESS,
  CLEAR_FILTERS,
  CHANGE_PAGE,
} from "./actions";

const initialState = {
  isLoading: false,
  showAlert: false,
  alertType: "",
  alertText: "",
  user: "",

  userLocation: "",
  showSidebar: false,
  isEditing: false,
  editJobId: "",
  position: "",
  company: "",
  jobLocation: "",
  jobTypeOptions: ["full-time", "part-time", "remote", "internship"],
  jobType: "full-time",
  statusOptions: ["pending", "interview", "declined"],
  status: "pending",
  jobs: [],
  totalJobs: 0,
  numOfPages: 1,
  page: 1,
  stats: {},
  monthlyApplications: [],
  search: "",
  searchStatus: "all",
  searchType: "all",
  sort: "latest",
  sortOptions: ["latest", "oldest", "a-z", "z-a"],
};

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const authFetch = axios.create({
    baseURL: "/api/v1",
  });

  authFetch.interceptors.response.use(
    (config) => {
      return config;
    },
    (error) => {
      console.log(error);
      if (error.response.status === 401) logoutUser();
      return Promise.reject(error);
    }
  );
  const getJobs = async () => {
    // will add page later
    const { page, search, searchStatus, searchType, sort } = state;

    let url = `/jobs?page=${page}&status=${searchStatus}&jobType=${searchType}&sort=${sort}`;
    if (search) {
      url = url + `&search=${search}`;
    }
    dispatch({ type: GET_JOBS_BEGIN });
    try {
      const { data } = await authFetch(url);
      const { jobs, totalJobs, numOfPages } = data.data;
      dispatch({
        type: GET_JOBS_SUCCESS,
        payload: {
          jobs,
          totalJobs,
          numOfPages,
        },
      });
    } catch (error) {
      logoutUser();
    }
    hideAlert();
  };

  useEffect(() => {
    getJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const displayAlert = () => {
    dispatch({ type: DISPLAY_ALERT });
    hideAlert();
  };

  const hideAlert = () => {
    setTimeout(() => {
      dispatch({ type: HIDE_ALERT });
    }, 3000);
  };

  const setUpUser = async ({ currentUser, endpoint, alertText }) => {
    dispatch({
      type: SETUP_USER_BEGIN,
    });
    try {
      const response = await axios.post(
        `/api/v1/auth/${endpoint}`,
        currentUser
      );
      // console.log(response.data);
      const { user, location } = response.data.data;
      dispatch({
        type: SETUP_USER_SUCCESS,
        payload: {
          user,

          location,
          alertText,
        },
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: SETUP_USER_ERROR,
        message: error.response.data.message,
      });
    }
    hideAlert();
  };

  const registerUser = async (currentUser) => {
    setUpUser({
      currentUser,
      endpoint: "register",
      alertText: "Registration Complete! redirecting...",
    });
  };

  const loginUser = async (currentUser) => {
    setUpUser({
      currentUser,
      endpoint: "login",
      alertText: "logged in successfully! redirecting...",
    });
  };
  const toggleSideBar = () => {
    dispatch({ type: TOGGLE_SIDEBAR });
  };

  const logoutUser = () => {
    dispatch({ type: LOGOUT_USER });
  };

  const updateUser = async (currentUser) => {
    // console.log(currentUser);
    dispatch({
      type: UPDATE_USER_BEGIN,
    });
    try {
      const { data } = await authFetch.patch("/auth/updateUser", currentUser);
      const { user, email, location } = data.data;

      dispatch({
        type: UPDATE_USER_SUCCESS,
        payload: { user, location, email },
      });
    } catch (error) {
      // console.log(error);
      if (error.response.status !== 401)
        dispatch({
          type: UPDATE_USER_ERROR,
          message: error.response.data.message,
        });
    }
    hideAlert();
  };

  const handleChange = (name, value) => {
    dispatch({
      type: HANDLE_CHANGE,
      payload: {
        name,
        value,
      },
    });
  };

  const clearValues = () => {
    dispatch({
      type: CLEAR_VALUE,
    });
  };

  const createJob = async () => {
    dispatch({ type: CREATE_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status } = state;
      await authFetch.post("/jobs", {
        position,
        company,
        jobLocation,
        jobType,
        status,
      });
      dispatch({
        type: CREATE_JOB_SUCCESS,
      });
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({
        type: CREATE_JOB_ERROR,
        message: error.response.data.message,
      });
    }
    hideAlert();
  };

  const setEditJob = (id) => {
    dispatch({ type: SET_EDIT_JOB, payload: { id } });
  };
  const editJob = async () => {
    dispatch({ type: EDIT_JOB_BEGIN });
    try {
      const { position, company, jobLocation, jobType, status, editJobId } =
        state;
      await authFetch.patch(`jobs/${editJobId}`, {
        position,
        company,
        jobLocation,
        status,
        jobType,
      });
      dispatch({ type: EDIT_JOB_SUCCESS });
      clearValues();
    } catch (error) {
      if (error.response.status === 401) return;
      dispatch({ type: EDIT_JOB_ERROR, payload: error.reponse.data.message });
    }
    hideAlert();
  };
  const deleteJob = async (jobId) => {
    dispatch({ type: DELETE_JOB_BEGIN });
    try {
      await authFetch.delete(`/jobs/${jobId}`);
      getJobs();
    } catch (error) {
      logoutUser();
    }
  };
  const showStats = async () => {
    dispatch({ type: SHOW_STATS_BEGIN });
    try {
      const { data } = await authFetch.get("jobs/showStats");

      const { defaultStats, monthlyApplications } = data.data;
      dispatch({
        type: SHOW_STATS_SUCCESS,
        payload: {
          stats: defaultStats,
          monthlyApplications: monthlyApplications,
        },
      });
    } catch (error) {
      // console.log(error);
      logoutUser();
    }

    hideAlert();
  };
  const clearFilters = () => {
    dispatch({ type: CLEAR_FILTERS });
  };

  const changePage = (page) => {
    dispatch({ type: CHANGE_PAGE, payload: { page } });
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        displayAlert,
        registerUser,
        loginUser,
        toggleSideBar,
        logoutUser,
        updateUser,
        handleChange,
        clearValues,
        createJob,
        getJobs,
        setEditJob,
        deleteJob,
        editJob,
        showStats,
        clearFilters,
        changePage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};

export { AppProvider, initialState };
