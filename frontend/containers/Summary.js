import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

const COLORS = ["#C75B39", "#7A9E7E", "#2C2825", "#D4C9BB", "#6B6560", "#D4A574", "#8B7355", "#A39E98"]

@inject('ExpenseStore', 'UserStore')
@observer
class Summary extends Component {
    componentWillMount() {
        const expenseSheetName = new URLSearchParams(this.props.location.search).get("expenseSheetName")
        this.props.ExpenseStore.fetchSummary(this.props.UserStore.user, expenseSheetName)
    }

    formatAmount(value) {
        const numericValue = Number(value || 0)
        return `₹${numericValue.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
            minimumFractionDigits: numericValue % 1 === 0 ? 0 : 2
        })}`
    }

    formatDateForInput(date) {
        const normalizedDate = new Date(date)
        const year = normalizedDate.getFullYear()
        const month = `${normalizedDate.getMonth() + 1}`.padStart(2, "0")
        const day = `${normalizedDate.getDate()}`.padStart(2, "0")
        return `${year}-${month}-${day}`
    }

    getYearTotal() {
        return Number(this.props.ExpenseStore.summary.yearToDateSummary.total || 0)
    }

    getMonthTotal() {
        return Number(this.props.ExpenseStore.summary.monthToDateSummary.total || 0)
    }

    getUserTotals() {
        return this.props.ExpenseStore.summary.monthToDateSummary.totalByUser || {}
    }

    getCategoryData() {
        return Object.entries(this.props.ExpenseStore.summary.monthToDateSummary.totalByCategory || {})
            .map(([label, value]) => ({ label, value: Number(value || 0) }))
            .sort((a, b) => b.value - a.value)
    }

    renderDonut(data, size = 140) {
        const total = data.reduce((sum, item) => sum + item.value, 0) || 1
        const radius = size / 2 - 10
        const cx = size / 2
        const cy = size / 2
        const strokeWidth = 20
        let accumulated = 0

        return <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="summary-donut">
            {data.map((item, index) => {
                const fraction = item.value / total
                const startAngle = accumulated * 2 * Math.PI - Math.PI / 2 + 0.02
                accumulated += fraction
                const endAngle = accumulated * 2 * Math.PI - Math.PI / 2 - 0.02
                if (endAngle <= startAngle) {
                    return null
                }
                const largeArc = endAngle - startAngle > Math.PI ? 1 : 0
                return <path
                    key={item.label}
                    d={`M ${cx + radius * Math.cos(startAngle)} ${cy + radius * Math.sin(startAngle)} A ${radius} ${radius} 0 ${largeArc} 1 ${cx + radius * Math.cos(endAngle)} ${cy + radius * Math.sin(endAngle)}`}
                    fill="none"
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />
            })}
            <text x={cx} y={cy - 6} textAnchor="middle" className="summary-donut-label">TOTAL</text>
            <text x={cx} y={cy + 16} textAnchor="middle" className="summary-donut-value">{this.formatAmount(total)}</text>
        </svg>
    }

    render() {
        const userTotals = this.getUserTotals()
        const categoryData = this.getCategoryData()
        const yearTotal = this.getYearTotal()
        const monthTotal = this.getMonthTotal()

        return <section className='main-component summary'>
            <div className="summary-hero-grid">
                <article className="hero-stat-card hero-stat-card-primary">
                    <p className="hero-stat-label">This year</p>
                    <p className="hero-stat-value">{this.formatAmount(yearTotal)}</p>
                </article>
                <article className="hero-stat-card">
                    <p className="hero-stat-label hero-stat-label-soft">This month</p>
                    <p className="hero-stat-value">{this.formatAmount(monthTotal)}</p>
                </article>
                <article className="hero-stat-card">
                    <p className="hero-stat-label hero-stat-label-soft">By user</p>
                    <div className="hero-user-list">
                        {Object.keys(userTotals).map((name, index) => (
                            <div key={name} className="hero-user-row">
                                <div className="hero-user-copy">
                                    <span className="hero-user-dot" style={{ background: index === 0 ? "#C75B39" : "#7A9E7E" }} />
                                    <span>{name}</span>
                                </div>
                                <span className="hero-user-amount">{this.formatAmount(userTotals[name])}</span>
                            </div>
                        ))}
                    </div>
                </article>
            </div>

            <section className="summary-donut-card">
                {this.renderDonut(categoryData)}
                <div className="summary-donut-legend">
                    {categoryData.slice(0, 6).map((item, index) => (
                        <div key={item.label} className="summary-legend-row">
                            <div className="summary-legend-copy">
                                <span className="summary-legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
                                <span>{item.label}</span>
                            </div>
                            <span className="summary-legend-value">{this.formatAmount(item.value)}</span>
                        </div>
                    ))}
                </div>
            </section>
        </section>
    }
}

export default Summary
