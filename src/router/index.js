import Vue from 'vue'
import Router from 'vue-router'
// import {routerMode} from './config/env'
import Dashboard from '@/components/Dashboard'
// import store from './../store/index'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard,
      // component: resolve => require(['@/pages/AppointmentRegister/RegisterIndex'], resolve),
      children: [
        {
          path: '/registerIndex',
          name: 'RegisterIndex',
          component (resolve) {
            require(['@/pages/AppointmentRegister/RegisterIndex'], resolve)
          }
        },
        {
          path: '/registerHistory',
          name: 'RegisterHistory',
          component (resolve) {
            require(['@/pages/AppointmentRegister/RegisterHistory'], resolve)
          }
        },
        {
          path: '/hospList',
          name: 'HospList',
          component (resolve) {
            require(['@/pages/AppointmentRegister/HospList'], resolve)
          }
        },
        {
          path: '/DoctorList',
          name: 'DoctorList',
          component (resolve) {
            require(['@/pages/AppointmentRegister/DoctorList'], resolve)
          }
        },
        {
          path: '/DoctorHomepage',
          name: 'DoctorHomepage',
          component (resolve) {
            require(['@/pages/AppointmentRegister/DoctorHomepage'], resolve)
          }
        },
        {
          path: '/DepartmentsList',
          name: 'DepartmentsList',
          component (resolve) {
            require(['@/pages/AppointmentRegister/DepartmentsList'], resolve)
          }
        },
        {
          path: '/paymentWait',
          name: 'PaymentWait',
          component (resolve) {
            require(['@/pages/PrescriptionPayment/PaymentWait'], resolve)
          }
        },
        {
          path: '/payIndex',
          name: 'PayIndex',
          component (resolve) {
            require(['@/pages/PrescriptionPayment/PayIndex'], resolve)
          }
        },
        {
          path: '/payHistory',
          name: 'PayHistory',
          component (resolve) {
            require(['@/pages/PrescriptionPayment/PayHistory'], resolve)
          }
        },
        // 挂号--挂号确认单
        {
          path: '/regConfirm',
          name: 'RegistrationConfirm',
          component (resolve) {
            require(['@/pages/AppointmentRegister/RegistrationConfirmPage'], resolve)
          }
        },
        // 挂号--挂号单详情
        {
          path: '/regDetail/:id',
          name: 'RegistrationDetail',
          component (resolve) {
            require(['@/pages/AppointmentRegister/RegistrationDetailPage'], resolve)
          }
        },
        // 挂号--支付详情
        {
          path: '/paymentDetail/:id',
          name: 'PaymentDetail',
          meta: {navigate: 'regDetail', current: 'paymentDetail'},
          component (resolve) {
            require(['@/pages/AppointmentRegister/PaymentDetailPage'], resolve)
          }
        },
        // 处方--支付详情
        {
          path: '/presPayment/:id',
          name: 'presPayment',
          meta: {navigate: 'presDetail', current: 'presPayment'},
          component (resolve) {
            require(['@/pages/AppointmentRegister/PaymentDetailPage'], resolve)
          }
        },
        // 挂号和处方 --支付结果
        {
          path: '/paymentResult/:id',
          name: 'PaymentResult',
          component (resolve) {
            require(['@/pages/AppointmentRegister/PaymentResult'], resolve)
          }
        },
        // 处方--处方详情
        {
          path: '/presDetail/:id',
          name: 'PresDetail',
          component (resolve) {
            require(['@/pages/PrescriptionPayment/PrescriptionDetailPage'], resolve)
          }
        },
        {
          path: '/rule',
          name: 'Rule',
          component (resolve) {
            require(['@/pages/AppointmentRegister/Rule'], resolve)
          }
        },
        {
          path: '/address',
          name: 'Address',
          component (resolve) {
            require(['@/pages/AppointmentRegister/Address'], resolve)
          }
        }
      ]
    }
  ],
  mode: 'history',
  strict: process.env.NODE_ENV !== 'production',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      if (from.meta.keepAlive) {
        from.meta.savedPosition = document.body.scrollTop
      }
      return { x: 0, y: to.meta.savedPosition || 0 }
    }
  }
})

// router.beforeEach((to, from, next) => {
//   // 全局首卫
//   const { openId } = store().state.app.institutionInfo
//   if (!openId && to.name !== 'Index') {
//     next({
//       path: '/index',
//       query: {redirect: to.fullPath}
//     })
//   } else {
//     next()
//   }
// })

export default router
